import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Search, Pencil, Send, ArrowRightLeft } from "lucide-react";
import { sendAdminEmail, brandedEmail } from "@/lib/admin/notify";

type Approval = "pending" | "approved" | "rejected";
type Row = {
  id: string;
  student_id: string;
  course_id: string;
  batch_id: string | null;
  payment_status: string;
  approval_status: Approval;
  total_fee: number;
  discount_amount: number;
  enrolled_at: string;
  scholarship_note: string | null;
  profiles?: { full_name: string; email: string } | null;
  courses?: { title: string } | null;
  batches?: { name: string } | null;
};
type Student = { id: string; email: string; full_name: string };
type Course = { id: string; title: string; fee: number | null };
type Batch = { id: string; course_id: string; name: string };

export default function AdminEnrollments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState<string>("none");
  const [totalFee, setTotalFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [scholarship, setScholarship] = useState("");
  const [approval, setApproval] = useState<Approval>("approved");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [transferring, setTransferring] = useState<Row | null>(null);
  const [transferBatch, setTransferBatch] = useState("");

  const load = async () => {
    const { data } = await supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false });
    const list = (data ?? []) as Row[];
    const sIds = [...new Set(list.map((r) => r.student_id))];
    const cIds = [...new Set(list.map((r) => r.course_id))];
    const bIds = [...new Set(list.map((r) => r.batch_id).filter(Boolean) as string[])];
    const [{ data: ps }, { data: cs }, { data: bs }] = await Promise.all([
      sIds.length ? supabase.from("profiles").select("id, full_name, email").in("id", sIds) : Promise.resolve({ data: [] }),
      cIds.length ? supabase.from("courses").select("id, title").in("id", cIds) : Promise.resolve({ data: [] }),
      bIds.length ? supabase.from("batches").select("id, name").in("id", bIds) : Promise.resolve({ data: [] }),
    ]);
    const pMap = new Map((ps ?? []).map((p: { id: string; full_name: string; email: string }) => [p.id, p]));
    const cMap = new Map((cs ?? []).map((c: { id: string; title: string }) => [c.id, c]));
    const bMap = new Map((bs ?? []).map((b: { id: string; name: string }) => [b.id, b]));
    setRows(list.map((r) => ({
      ...r,
      profiles: pMap.get(r.student_id) ? { full_name: pMap.get(r.student_id)!.full_name, email: pMap.get(r.student_id)!.email } : null,
      courses: cMap.get(r.course_id) ? { title: cMap.get(r.course_id)!.title } : null,
      batches: r.batch_id && bMap.get(r.batch_id) ? { name: bMap.get(r.batch_id)!.name } : null,
    })));
  };

  useEffect(() => {
    load();
    supabase.from("profiles").select("id, email, full_name").order("created_at", { ascending: false }).then(({ data }) => setStudents((data ?? []) as Student[]));
    supabase.from("courses").select("id, title, fee").order("title").then(({ data }) => setCourses((data ?? []) as Course[]));
    supabase.from("batches").select("id, course_id, name").order("name").then(({ data }) => setBatches((data ?? []) as Batch[]));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (approvalFilter !== "all" && r.approval_status !== approvalFilter) return false;
      if (!s) return true;
      return (
        r.profiles?.email.toLowerCase().includes(s) ||
        r.profiles?.full_name?.toLowerCase().includes(s) ||
        r.courses?.title?.toLowerCase().includes(s)
      );
    });
  }, [rows, q, approvalFilter]);

  const del = async (id: string) => {
    if (!confirm("Remove this enrollment?")) return;
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const create = async () => {
    if (!studentId || !courseId) return;
    setBusy(true);
    const { error } = await supabase.from("enrollments").insert({
      student_id: studentId,
      course_id: courseId,
      batch_id: batchId === "none" ? null : batchId,
      payment_status: "completed",
      approval_status: approval,
      total_fee: totalFee,
      discount_amount: discount,
      scholarship_note: scholarship || null,
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Enrollment created" });

    if (approval === "approved") {
      const student = students.find((s) => s.id === studentId);
      const course = courses.find((c) => c.id === courseId);
      if (student?.email) {
        sendAdminEmail({
          to: student.email,
          subject: `Enrollment confirmed: ${course?.title ?? "Course"}`,
          html: brandedEmail("You're enrolled!", `<p>Hi ${student.full_name || "there"},</p><p>You have been enrolled in <strong>${course?.title}</strong>. Log in to your dashboard to start learning.</p>`),
          template: "enrollment_confirmation",
          recipientId: student.id,
        }).catch(() => null);
      }
    }
    setOpen(false);
    setStudentId(""); setCourseId(""); setBatchId("none"); setTotalFee(0); setDiscount(0); setScholarship(""); setApproval("approved");
    load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    const { error } = await supabase.from("enrollments").update({
      approval_status: editing.approval_status,
      total_fee: editing.total_fee,
      discount_amount: editing.discount_amount,
      scholarship_note: editing.scholarship_note,
      batch_id: editing.batch_id,
    }).eq("id", editing.id);
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Updated" });
    setEditing(null);
    load();
  };

  const transferNow = async () => {
    if (!transferring || !transferBatch) return;
    const { error } = await supabase.from("enrollments").update({
      previous_batch_id: transferring.batch_id,
      batch_id: transferBatch,
    }).eq("id", transferring.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Transferred to new batch" });
    setTransferring(null); setTransferBatch("");
    load();
  };

  const availableBatchesForCourse = (cid: string) => batches.filter((b) => b.course_id === cid);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> New</Button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search student or course" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={approvalFilter} onValueChange={setApprovalFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All approvals</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Batch</th>
              <th className="text-left p-3">Fee</th>
              <th className="text-left p-3">Discount</th>
              <th className="text-left p-3">Approval</th>
              <th className="text-left p-3">Date</th>
              <th className="text-right p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium">{r.profiles?.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.profiles?.email}</div>
                </td>
                <td className="p-3">{r.courses?.title || "—"}</td>
                <td className="p-3">{r.batches?.name ?? "—"}</td>
                <td className="p-3">₹{Number(r.total_fee).toLocaleString("en-IN")}</td>
                <td className="p-3">{r.discount_amount > 0 ? `₹${Number(r.discount_amount).toLocaleString("en-IN")}` : "—"}</td>
                <td className="p-3"><Badge variant={r.approval_status === "approved" ? "default" : r.approval_status === "pending" ? "secondary" : "outline"}>{r.approval_status}</Badge></td>
                <td className="p-3 text-muted-foreground text-xs">{new Date(r.enrolled_at).toLocaleDateString()}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setTransferring(r); setTransferBatch(""); }}><ArrowRightLeft className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-3 w-3" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No enrollments.</td></tr>}
          </tbody>
        </table>
      </Card>

      {/* Create */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Create enrollment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name ? `${s.full_name} — ${s.email}` : s.email}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course</Label>
              <Select value={courseId} onValueChange={(v) => { setCourseId(v); setTotalFee(courses.find((c) => c.id === v)?.fee ?? 0); setBatchId("none"); }}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {courseId && (
              <div>
                <Label>Batch (optional)</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No batch</SelectItem>
                    {availableBatchesForCourse(courseId).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Total fee (₹)</Label><Input type="number" value={totalFee} onChange={(e) => setTotalFee(Number(e.target.value))} /></div>
              <div><Label>Discount (₹)</Label><Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></div>
            </div>
            <div><Label>Scholarship / discount note</Label><Input value={scholarship} onChange={(e) => setScholarship(e.target.value)} /></div>
            <div>
              <Label>Approval</Label>
              <Select value={approval} onValueChange={(v) => setApproval(v as Approval)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved (instant access)</SelectItem>
                  <SelectItem value="pending">Pending approval</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create} disabled={!studentId || !courseId || busy}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit enrollment</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Approval</Label>
                <Select value={editing.approval_status} onValueChange={(v) => setEditing({ ...editing, approval_status: v as Approval })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Total fee</Label><Input type="number" value={editing.total_fee} onChange={(e) => setEditing({ ...editing, total_fee: Number(e.target.value) })} /></div>
                <div><Label>Discount</Label><Input type="number" value={editing.discount_amount} onChange={(e) => setEditing({ ...editing, discount_amount: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Scholarship note</Label><Input value={editing.scholarship_note ?? ""} onChange={(e) => setEditing({ ...editing, scholarship_note: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={busy}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer */}
      <Dialog open={!!transferring} onOpenChange={(o) => !o && setTransferring(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transfer to another batch</DialogTitle></DialogHeader>
          {transferring && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Current batch: {transferring.batches?.name ?? "None"}</p>
              <Select value={transferBatch} onValueChange={setTransferBatch}>
                <SelectTrigger><SelectValue placeholder="Pick new batch" /></SelectTrigger>
                <SelectContent>
                  {availableBatchesForCourse(transferring.course_id).filter((b) => b.id !== transferring.batch_id).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferring(null)}>Cancel</Button>
            <Button onClick={transferNow} disabled={!transferBatch}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
