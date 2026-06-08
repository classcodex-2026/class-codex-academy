import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

type BatchStatus = "upcoming" | "running" | "completed" | "cancelled";
type Batch = {
  id: string;
  course_id: string;
  name: string;
  trainer_name: string | null;
  trainer_email: string | null;
  start_date: string | null;
  end_date: string | null;
  schedule: string | null;
  capacity: number | null;
  status: BatchStatus;
  notes: string | null;
};
type Course = { id: string; title: string };

const empty: Omit<Batch, "id"> = {
  course_id: "", name: "", trainer_name: "", trainer_email: "",
  start_date: "", end_date: "", schedule: "", capacity: null,
  status: "upcoming", notes: "",
};

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Batch | null>(null);
  const [form, setForm] = useState<Omit<Batch, "id">>(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [{ data: b }, { data: cs }, { data: en }] = await Promise.all([
      supabase.from("batches").select("*").order("start_date", { ascending: false }),
      supabase.from("courses").select("id, title").order("title"),
      supabase.from("enrollments").select("batch_id"),
    ]);
    setBatches((b ?? []) as Batch[]);
    setCourses((cs ?? []) as Course[]);
    const map: Record<string, number> = {};
    (en ?? []).forEach((r: { batch_id: string | null }) => {
      if (r.batch_id) map[r.batch_id] = (map[r.batch_id] ?? 0) + 1;
    });
    setCounts(map);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEdit(null); setForm(empty); setOpen(true); };
  const startEdit = (b: Batch) => {
    setEdit(b);
    setForm({
      course_id: b.course_id, name: b.name,
      trainer_name: b.trainer_name ?? "", trainer_email: b.trainer_email ?? "",
      start_date: b.start_date ?? "", end_date: b.end_date ?? "",
      schedule: b.schedule ?? "", capacity: b.capacity,
      status: b.status, notes: b.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.course_id || !form.name) return toast({ title: "Course and name required", variant: "destructive" });
    setBusy(true);
    const payload = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      trainer_name: form.trainer_name || null,
      trainer_email: form.trainer_email || null,
      schedule: form.schedule || null,
      notes: form.notes || null,
    };
    const { error } = edit
      ? await supabase.from("batches").update(payload).eq("id", edit.id)
      : await supabase.from("batches").insert(payload);
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: edit ? "Batch updated" : "Batch created" });
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this batch?")) return;
    const { error } = await supabase.from("batches").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const courseMap = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Batches</h1>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> New Batch</Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Batch</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Trainer</th>
              <th className="text-left p-3">Schedule</th>
              <th className="text-left p-3">Dates</th>
              <th className="text-left p-3">Students</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3"></th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 font-medium">{b.name}</td>
                <td className="p-3">{courseMap.get(b.course_id) ?? "—"}</td>
                <td className="p-3">{b.trainer_name ?? "—"}</td>
                <td className="p-3">{b.schedule ?? "—"}</td>
                <td className="p-3 text-muted-foreground text-xs">
                  {b.start_date ? new Date(b.start_date).toLocaleDateString() : "—"} → {b.end_date ? new Date(b.end_date).toLocaleDateString() : "—"}
                </td>
                <td className="p-3">{counts[b.id] ?? 0}{b.capacity ? `/${b.capacity}` : ""}</td>
                <td className="p-3"><Badge variant={b.status === "running" ? "default" : "secondary"}>{b.status}</Badge></td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(b)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(b.id)}><Trash2 className="h-3 w-3" /></Button>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No batches yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{edit ? "Edit batch" : "New batch"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Course</Label>
              <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
                <SelectTrigger><SelectValue placeholder="Choose course" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Batch name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jan-2026 Evening" /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as BatchStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Trainer name</Label><Input value={form.trainer_name ?? ""} onChange={(e) => setForm({ ...form, trainer_name: e.target.value })} /></div>
            <div><Label>Trainer email</Label><Input type="email" value={form.trainer_email ?? ""} onChange={(e) => setForm({ ...form, trainer_email: e.target.value })} /></div>
            <div><Label>Start date</Label><Input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
            <div><Label>End date</Label><Input type="date" value={form.end_date ?? ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
            <div><Label>Schedule</Label><Input value={form.schedule ?? ""} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Mon/Wed/Fri 7-9pm" /></div>
            <div><Label>Capacity</Label><Input type="number" value={form.capacity ?? ""} onChange={(e) => setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : null })} /></div>
            <div className="col-span-2"><Label>Notes</Label><Textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{edit ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
