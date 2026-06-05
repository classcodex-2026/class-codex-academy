import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/admin/upload";
import { Loader2 } from "lucide-react";

type Settings = {
  website_name: string;
  tagline: string;
  logo_url: string | null;
  whatsapp_number: string;
  contact_email: string;
  about_us: string | null;
  footer_content: string | null;
  social_links: Record<string, string>;
};

export default function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) setS({
        website_name: data.website_name ?? "",
        tagline: data.tagline ?? "",
        logo_url: data.logo_url,
        whatsapp_number: data.whatsapp_number ?? "",
        contact_email: data.contact_email ?? "",
        about_us: data.about_us,
        footer_content: data.footer_content,
        social_links: (data.social_links ?? {}) as Record<string, string>,
      });
    });
  }, []);

  const save = async () => {
    if (!s) return;
    setBusy(true);
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setBusy(false);
    if (error) toast({ title: error.message, variant: "destructive" });
    else toast({ title: "Settings saved" });
  };

  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !s) return;
    try {
      const url = await uploadFile("site-assets", f);
      setS({ ...s, logo_url: url });
      toast({ title: "Logo uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  };

  if (!s) return <AdminLayout><Loader2 className="h-6 w-6 animate-spin" /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Website Settings</h1>
      <Card>
        <CardContent className="pt-6 space-y-4 max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Website Name"><Input value={s.website_name} onChange={(e) => setS({ ...s, website_name: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} /></Field>
            <Field label="WhatsApp Number"><Input value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} placeholder="919629997602" /></Field>
            <Field label="Contact Email"><Input value={s.contact_email} onChange={(e) => setS({ ...s, contact_email: e.target.value })} /></Field>
          </div>
          <Field label="Logo">
            {s.logo_url && <img src={s.logo_url} alt="" className="h-16 mb-2" />}
            <Input type="file" accept="image/*" onChange={onLogo} />
          </Field>
          <Field label="About Us"><Textarea rows={5} value={s.about_us ?? ""} onChange={(e) => setS({ ...s, about_us: e.target.value })} /></Field>
          <Field label="Footer Content"><Textarea rows={3} value={s.footer_content ?? ""} onChange={(e) => setS({ ...s, footer_content: e.target.value })} /></Field>

          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <div className="grid grid-cols-2 gap-3">
              {["instagram", "facebook", "linkedin", "youtube", "twitter"].map((k) => (
                <Input
                  key={k}
                  placeholder={k.charAt(0).toUpperCase() + k.slice(1) + " URL"}
                  value={s.social_links[k] ?? ""}
                  onChange={(e) => setS({ ...s, social_links: { ...s.social_links, [k]: e.target.value } })}
                />
              ))}
            </div>
          </div>

          <Button onClick={save} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
