import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claims, error: cErr } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (cErr || !claims?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const { course_id } = await req.json();
    if (!course_id) return json({ error: "course_id required" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: course } = await admin.from("courses").select("id, title, fee").eq("id", course_id).maybeSingle();
    if (!course || !course.fee) return json({ error: "Course unavailable" }, 400);

    // Prevent duplicate active enrollment
    const { data: existing } = await admin.from("enrollments")
      .select("payment_status").eq("student_id", userId).eq("course_id", course_id).maybeSingle();
    if (existing?.payment_status === "completed") {
      return json({ error: "Already enrolled" }, 409);
    }

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const amountPaise = Math.round(Number(course.fee) * 100);

    if (!keyId || !keySecret) {
      // Placeholder mode — return a mock order so UI can be tested before adding Razorpay keys
      const mockOrderId = `order_mock_${crypto.randomUUID().slice(0, 12)}`;
      await admin.from("payments").insert({
        student_id: userId, course_id, razorpay_order_id: mockOrderId,
        amount: course.fee, status: "pending",
      });
      return json({
        order_id: mockOrderId, amount: amountPaise, currency: "INR",
        key_id: "rzp_test_placeholder", placeholder: true,
      });
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountPaise, currency: "INR",
        notes: { course_id, student_id: userId },
      }),
    });
    const order = await resp.json();
    if (!resp.ok) return json({ error: order.error?.description || "Razorpay error" }, 500);

    await admin.from("payments").insert({
      student_id: userId, course_id, razorpay_order_id: order.id,
      amount: course.fee, status: "pending",
    });

    return json({ order_id: order.id, amount: order.amount, currency: order.currency, key_id: keyId });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
