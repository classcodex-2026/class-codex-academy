import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAdmin } from "@/lib/admin/useAdmin";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => setAdminExists((count ?? 0) > 0));
  }, []);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate("/admin", { replace: true });
  }, [session, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({ title: "Admin account created", description: "You are now signed in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const showSignup = adminExists === false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin {mode === "signup" ? "Setup" : "Login"}</CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Create the first admin account. Only this account will have admin access."
              : "Sign in to manage your ClassCodex website."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {mode === "signup" ? "Create Admin Account" : "Sign In"}
            </Button>
            {showSignup && (
              <p className="text-xs text-center text-muted-foreground">
                {mode === "signin" ? (
                  <>
                    First time?{" "}
                    <button
                      type="button"
                      className="text-primary underline"
                      onClick={() => setMode("signup")}
                    >
                      Create admin account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setMode("signin")}
                  >
                    Back to sign in
                  </button>
                )}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
