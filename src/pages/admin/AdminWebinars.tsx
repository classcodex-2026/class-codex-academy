import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/admin/upload";
import { Plus, Trash2 } from "lucide-react";

type Webinar = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  banner_url: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: "upcoming" | "completed";
  recording_url: string | null;
};

const empty: Omit<Webinar, "id"> = {
  title: "", description: "", content: "", banner_url: "",
  scheduled_date: "", scheduled_time: "", status: "upcoming", recording_url: "",
};

export default function AdminWebinars() {
  const [list, setList] = useState<Webinar[]>([]);
  const [editing, setEditing] = useState<Webinar | null>(null);
  const [draft, setDraft] = useState<typeof empty>(empty);

  const load = async () => {
    const { data } = await supabase.from("webinars").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as Webinar[]);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing({ ...empty, id: "" } as Webinar); setDraft(empty); };
  const startEdit = (w: Webinar) => { setEditing(w); setDraft(w); };

  const save = async () => {
    const payload = { ...draft };
    if (!payload.title) return toast({ title: "Title required", variant: "destructive" });
    if (editing?.id) {
      const { error } = await supabase.from("webinars").update(payload).eq("id", editing.id);
      if (error) return toast({ title: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("webinars").insert(payload);
      if (error) return toast({ title: error.message, variant: "destructive" });
    }
    toast({ title: "Webinar saved" });
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this webinar?")) return;
    await supabase.from("webinars").delete().eq("id", id);
    load();
  };

  const onBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadFile("webinar-banners", f);
      setDraft({ ...draft, banner_url: url });
      toast({ title: "Banner uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Webinars</h1>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Add Webinar</Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <CardHeader><CardTitle>{editing.id ? "Edit Webinar" : "New Webinar"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Title"><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={2} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
            <Field label="Content"><Textarea rows={4} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Date"><Input type="date" value={draft.scheduled_date ?? ""} onChange={(e) => setDraft({ ...draft, scheduled_date: e.target.value })} /></Field>
              <Field label="Time"><Input value={draft.scheduled_time ?? ""} placeholder="e.g. 7:00 PM IST" onChange={(e) => setDraft({ ...draft, scheduled_time: e.target.value })} /></Field>
              <Field label="Status">
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as Webinar["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Recording URL"><Input value={draft.recording_url ?? ""} onChange={(e) => setDraft({ ...draft, recording_url: e.target.value })} /></Field>
            <Field label="Banner">
              {draft.banner_url && <img src={draft.banner_url} className="h-24 mb-2 rounded" alt="" />}
              <Input type="file" accept="image/*" onChange={onBanner} />
            </Field>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {list.map((w) => (
          <Card key={w.id}>
            <CardContent className="pt-6 flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{w.title}</h3>
                  <Badge variant={w.status === "upcoming" ? "default" : "secondary"}>{w.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{w.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{w.scheduled_date} {w.scheduled_time}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(w)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => del(w.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {list.length === 0 && !editing && <p className="text-muted-foreground text-sm">No webinars yet.</p>}
      </div>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
