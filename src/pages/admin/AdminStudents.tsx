import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Eye, Pencil, Trash2, Plus, Search, Upload, Download } from "lucide-react";

type Status = "active" | "inactive" | "graduated" | "dropped";
type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  status: Status;
  notes: string | null;
  created_at: string;
};
type Course = { id: string; title: string; fee: number | null };

const emptyForm = { full_name: "", email: "", phone: "", status: "active" as Status, notes: "" };

export default function AdminStudents() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<{ id: string; course_id: string; payment_status: string; enrolled_at: string; course?: string }[]>([]);
  const [payments, setPayments] = useState<{ id: string; amount: number; status: string; created_at: string; course?: string }[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [pickedCourse, setPickedCourse] = useState("");
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [{ data: p }, { data: en }, { data: cs }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("enrollments").select("student_id"),
      supabase.from("courses").select("id, title, fee").order("title"),
    ]);
    setStudents((p ?? []) as Profile[]);
    const map: Record<string, number> = {};
    (en ?? []).forEach((r: { student_id: string }) => {
      map[r.student_id] = (map[r.student_id] ?? 0) + 1;
    });
    setCounts(map);
    setCourses((cs ?? []) as Course[]);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return students.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (!s) return true;
      return (
        u.email.toLowerCase().includes(s) ||
        (u.full_name ?? "").toLowerCase().includes(s) ||
        (u.phone ?? "").toLowerCase().includes(s)
      );
    });
  }, [q, students, statusFilter]);

  const openProfile = async (p: Profile) => {
    setView(p);
    const [{ data: en }, { data: py }] = await Promise.all([
      supabase.from("enrollments").select("id, course_id, payment_status, enrolled_at").eq("student_id", p.id).order("enrolled_at", { ascending: false }),
      supabase.from("payments").select("id, course_id, amount, status, created_at").eq("student_id", p.id).order("created_at", { ascending: false }),
    ]);
    const enList = (en ?? []) as { id: string; course_id: string; payment_status: string; enrolled_at: string }[];
    const pyList = (py ?? []) as { id: string; course_id: string; amount: number; status: string; created_at: string }[];
    const ids = [...new Set([...enList.map((e) => e.course_id), ...pyList.map((x) => x.course_id)])];
    const { data: cs } = ids.length
      ? await supabase.from("courses").select("id, title").in("id", ids)
      : { data: [] as { id: string; title: string }[] };
    const cMap = new Map((cs ?? []).map((c) => [c.id, c.title]));
    setEnrollments(enList.map((e) => ({ ...e, course: cMap.get(e.course_id) })));
    setPayments(pyList.map((x) => ({ ...x, course: cMap.get(x.course_id) })));
  };

  const startEdit = (p: Profile) => {
    setEditing(p);
    setForm({
      full_name: p.full_name ?? "",
      email: p.email,
      phone: p.phone ?? "",
      status: p.status,
      notes: p.notes ?? "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone || null,
      status: form.status,
      notes: form.notes || null,
    }).eq("id", editing.id);
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Student updated" });
    setEditOpen(false);
    load();
  };

  const addStudent = async () => {
    if (!form.email) return toast({ title: "Email is required", variant: "destructive" });
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: Math.random().toString(36).slice(2) + "Aa1!",
      options: { data: { full_name: form.full_name } },
    });
    if (error || !data.user) {
      setBusy(false);
      return toast({ title: "Failed", description: error?.message ?? "Could not create user", variant: "destructive" });
    }
    await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone || null,
      status: form.status,
      notes: form.notes || null,
    }).eq("id", data.user.id);
    setBusy(false);
    toast({ title: "Student added", description: "They can reset their password to log in." });
    setAddOpen(false);
    setForm(emptyForm);
    load();
  };

  const removeStudent = async (p: Profile) => {
    if (!confirm(`Delete ${p.email}? This removes their profile, enrollments, and payments references.`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", p.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Student deleted" });
    load();
  };

  const removeEnrollment = async (id: string) => {
    if (!confirm("Remove this enrollment?")) return;
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    if (view) openProfile(view);
    load();
  };

  const enrollNow = async () => {
    if (!view || !pickedCourse) return;
    setBusy(true);
    const course = courses.find((c) => c.id === pickedCourse);
    const { error } = await supabase.from("enrollments").insert({
      student_id: view.id,
      course_id: pickedCourse,
      payment_status: "completed",
      total_fee: course?.fee ?? 0,
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Student enrolled" });
    setEnrollOpen(false);
    setPickedCourse("");
    openProfile(view);
    load();
  };

  const exportCsv = () => {
    const data = filtered.map((s) => ({
      Name: s.full_name,
      Email: s.email,
      Phone: s.phone ?? "",
      Status: s.status,
      Enrollments: counts[s.id] ?? 0,
      Joined: new Date(s.created_at).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `students-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const importFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf);
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(wb.Sheets[wb.SheetNames[0]]);
    let ok = 0, fail = 0;
    for (const row of rows) {
      const email = (row.Email || row.email || "").toString().trim();
      const name = (row.Name || row.name || row.full_name || "").toString().trim();
      const phone = (row.Phone || row.phone || "").toString().trim();
      if (!email) { fail++; continue; }
      const { data, error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(2) + "Aa1!",
        options: { data: { full_name: name } },
      });
      if (error || !data.user) { fail++; continue; }
      await supabase.from("profiles").update({
        full_name: name, phone: phone || null, status: "active",
      }).eq("id", data.user.id);
      ok++;
    }
    toast({ title: "Import complete", description: `${ok} added, ${fail} failed` });
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const enrolledIds = new Set(enrollments.map((e) => e.course_id));
  const availableCourses = courses.filter((c) => !enrolledIds.has(c.id));
  const statusVariant = (s: Status) =>
    s === "active" ? "default" : s === "graduated" ? "secondary" : "outline";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Import
          </Button>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={importFile} />
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Student
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
            <SelectItem value="dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Enrollments</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-medium">{u.full_name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone ?? "—"}</td>
                <td className="p-3"><Badge variant={statusVariant(u.status)}>{u.status}</Badge></td>
                <td className="p-3"><Badge variant="secondary">{counts[u.id] ?? 0}</Badge></td>
                <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => openProfile(u)}><Eye className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(u)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => removeStudent(u)}><Trash2 className="h-3 w-3" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Profile dialog */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{view?.full_name || view?.email}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Info label="Email" value={view.email} />
                <Info label="Phone" value={view.phone ?? "—"} />
                <Info label="Status" value={view.status} />
                <Info label="Joined" value={new Date(view.created_at).toLocaleDateString()} />
              </div>
              {view.notes && <Info label="Notes" value={view.notes} />}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Enrollments ({enrollments.length})</h3>
                  <Button size="sm" onClick={() => setEnrollOpen(true)}><Plus className="h-3 w-3 mr-1" /> Enroll</Button>
                </div>
                <SimpleTable
                  head={["Course", "Status", "Date", ""]}
                  rows={enrollments.map((e) => [
                    e.course ?? "—",
                    <Badge key="s" variant={e.payment_status === "completed" ? "default" : "secondary"}>{e.payment_status}</Badge>,
                    new Date(e.enrolled_at).toLocaleDateString(),
                    <Button key="d" size="sm" variant="ghost" onClick={() => removeEnrollment(e.id)}><Trash2 className="h-3 w-3" /></Button>,
                  ])}
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payments ({payments.length})</h3>
                <SimpleTable
                  head={["Course", "Amount", "Status", "Date"]}
                  rows={payments.map((p) => [
                    p.course ?? "—",
                    `₹${Number(p.amount).toLocaleString("en-IN")}`,
                    <Badge key="s" variant={p.status === "completed" ? "default" : "secondary"}>{p.status}</Badge>,
                    new Date(p.created_at).toLocaleDateString(),
                  ])}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit */}
      <Dialog open={addOpen || editOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditOpen(false); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editOpen ? "Edit student" : "Add student"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={editOpen} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); setEditOpen(false); }}>Cancel</Button>
            <Button onClick={editOpen ? saveEdit : addStudent} disabled={busy}>{editOpen ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll {view?.email}</DialogTitle></DialogHeader>
          <Select value={pickedCourse} onValueChange={setPickedCourse}>
            <SelectTrigger><SelectValue placeholder="Choose course" /></SelectTrigger>
            <SelectContent>
              {availableCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollOpen(false)}>Cancel</Button>
            <Button onClick={enrollNow} disabled={!pickedCourse || busy}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-muted-foreground text-xs">{label}</p><p className="font-medium">{value}</p></div>;
}
function SimpleTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="border border-border rounded">
      <table className="w-full">
        <thead className="bg-muted/40 text-xs">
          <tr>{head.map((h, i) => <th key={i} className="text-left p-2">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((c, j) => <td key={j} className="p-2">{c}</td>)}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={head.length} className="p-3 text-center text-muted-foreground">None</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
