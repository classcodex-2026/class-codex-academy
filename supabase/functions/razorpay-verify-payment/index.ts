import { createClient } from "npm:@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id) return json({ error: "Missing order id" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: payment } = await admin.from("payments")
      .select("*").eq("razorpay_order_id", razorpay_order_id).eq("student_id", userId).maybeSingle();
    if (!payment) return json({ error: "Payment not found" }, 404);
    if (payment.status === "completed") return json({ success: true, already: true });

    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const isPlaceholder = razorpay_order_id.startsWith("order_mock_");

    if (!isPlaceholder) {
      if (!keySecret) return json({ error: "Razorpay not configured" }, 500);
      const expected = createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
      if (expected !== razorpay_signature) {
        await admin.from("payments").update({ status: "failed" }).eq("id", payment.id);
        return json({ error: "Invalid signature" }, 400);
      }
    }

    await admin.from("payments").update({
      status: "completed",
      razorpay_payment_id: razorpay_payment_id ?? `pay_mock_${crypto.randomUUID().slice(0, 12)}`,
      razorpay_signature: razorpay_signature ?? null,
    }).eq("id", payment.id);

    await admin.from("enrollments").upsert({
      student_id: userId, course_id: payment.course_id,
      payment_id: payment.id, payment_status: "completed",
    }, { onConflict: "student_id,course_id" });

    return json({ success: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
