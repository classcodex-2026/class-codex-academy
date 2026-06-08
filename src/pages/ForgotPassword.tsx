import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send reset email", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Email sent", description: "Check your inbox for a password reset link." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <motion.form onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-2xl p-8 space-y-5 shadow-sm">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <KeyRound className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send reset link
            </Button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">Back to login</Link>
            </p>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
