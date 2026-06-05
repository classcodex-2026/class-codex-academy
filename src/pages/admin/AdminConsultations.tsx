import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Eye, Check } from "lucide-react";

type Req = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  interested_course: string | null;
  requirement: string | null;
  contacted: boolean;
  submitted_at: string;
};

export default function AdminConsultations() {
  const [list, setList] = useState<Req[]>([]);
  const [view, setView] = useState<Req | null>(null);

  const load = async () => {
    const { data } = await supabase.from("consultation_requests").select("*").order("submitted_at", { ascending: false });
    setList((data ?? []) as Req[]);
  };
  useEffect(() => { load(); }, []);

  const markContacted = async (id: string) => {
    await supabase.from("consultation_requests").update({ contacted: true }).eq("id", id);
    toast({ title: "Marked as contacted" });
    load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await supabase.from("consultation_requests").delete().eq("id", id);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Consultation Requests</h1>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">WhatsApp</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Submitted</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.whatsapp ?? "—"}</td>
                <td className="p-3">{r.interested_course ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{new Date(r.submitted_at).toLocaleString()}</td>
                <td className="p-3">
                  <Badge variant={r.contacted ? "secondary" : "default"}>
                    {r.contacted ? "Contacted" : "New"}
                  </Badge>
                </td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="outline" onClick={() => setView(r)}><Eye className="h-3 w-3" /></Button>
                  {!r.contacted && (
                    <Button size="sm" variant="outline" onClick={() => markContacted(r.id)}><Check className="h-3 w-3" /></Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => del(r.id)}><Trash2 className="h-3 w-3" /></Button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No requests yet.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {view.email}</p>
              <p><strong>WhatsApp:</strong> {view.whatsapp ?? "—"}</p>
              <p><strong>Course:</strong> {view.interested_course ?? "—"}</p>
              <p><strong>Submitted:</strong> {new Date(view.submitted_at).toLocaleString()}</p>
              <div>
                <strong>Requirement:</strong>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{view.requirement ?? "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
