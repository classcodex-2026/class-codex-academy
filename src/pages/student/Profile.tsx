import { useEffect, useState } from "react";
import StudentLayout from "@/components/student/StudentLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles")
        .select("full_name, created_at").eq("id", user.id).maybeSingle();
      setFullName(data?.full_name ?? "");
      setCreatedAt(data?.created_at ?? user.created_at);
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles")
      .update({ full_name: fullName.trim() }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile updated" });
  };

  return (
    <StudentLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled className="mt-2" />
                </div>
                <div>
                  <Label>Account Created</Label>
                  <Input value={new Date(createdAt).toLocaleString()} disabled className="mt-2" />
                </div>
                <Button onClick={save} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default Profile;
