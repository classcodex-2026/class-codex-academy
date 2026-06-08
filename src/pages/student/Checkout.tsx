import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window { Razorpay: any }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const Checkout = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
      setCourse(data);
      setLoading(false);
    })();
  }, [courseId]);

  const handlePay = async () => {
    if (!user || !course) return;
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
        body: { course_id: course.id },
      });
      if (error || !data?.order_id) throw new Error(error?.message || "Could not create order");

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load Razorpay");

      const rzp = new window.Razorpay({
        key: data.key_id || RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "ClassCodex",
        description: course.title,
        prefill: { email: user.email, name: user.user_metadata?.full_name },
        theme: { color: "#2563EB" },
        handler: async (resp: any) => {
          const { data: verify, error: vErr } = await supabase.functions.invoke("razorpay-verify-payment", {
            body: {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            },
          });
          if (vErr || !verify?.success) {
            navigate("/payment-failure");
            return;
          }
          navigate("/payment-success");
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.on("payment.failed", () => navigate("/payment-failure"));
      rzp.open();
    } catch (e: any) {
      toast({ title: "Payment error", description: e.message, variant: "destructive" });
      setPaying(false);
    }
  };

  if (loading) {
    return <StudentLayout><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></StudentLayout>;
  }
  if (!course) {
    return <StudentLayout><p>Course not found.</p></StudentLayout>;
  }

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
        <Card>
          <CardHeader><CardTitle>{course.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{course.tagline}</p>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between"><span>Course Fee</span><span>₹{Number(course.fee || 0).toLocaleString()}</span></div>
              {course.original_fee && (
                <div className="flex justify-between text-muted-foreground line-through text-sm">
                  <span>Original</span><span>₹{Number(course.original_fee).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span><span className="text-primary">₹{Number(course.fee || 0).toLocaleString()}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handlePay} disabled={paying}>
              {paying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
              Pay with Razorpay
            </Button>
            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" /> Secure payments powered by Razorpay
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default Checkout;
