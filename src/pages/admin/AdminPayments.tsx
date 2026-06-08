import { useEffect, useMemo, useState } from "react";
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
import { Search, IndianRupee, Plus, Pencil, Trash2, Receipt, RotateCcw, Send } from "lucide-react";
import { generateReceiptPdf } from "@/lib/admin/invoice";
import { sendAdminEmail, brandedEmail } from "@/lib/admin/notify";

type Payment = {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  payment_type: string;
  receipt_number: string | null;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
};
type Student = { id: string; full_name: string; email: string };
type Course = { id: string; title: string; fee: number | null };
type Enrollment = { id: string; student_id: string; course_id: string; total_fee: number; discount_amount: number };

const empty = {
  student_id: "", course_id: "",
  amount: 0, status: "completed",
  payment_method: "cash", payment_type: "manual",
  due_date: "", paid_at: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function AdminPayments() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Map<string, Student>>(new Map());
  const [courses, setCourses] = useState<Map<string, Course>>(new Map());
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Payment | null>(null);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [refundOpen, setRefundOpen] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");

  const load = async () => {
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    const list = (data ?? []) as Payment[];
    setRows(list);
    const sIds = [...new Set(list.map((r) => r.student_id))];
    const cIds = [...new Set(list.map((r) => r.course_id))];
    const [{ data: ps }, { data: cs }] = await Promise.all([
      sIds.length ? supabase.from("profiles").select("id, full_name, email").in("id", sIds) : Promise.resolve({ data: [] }),
      cIds.length ? supabase.from("courses").select("id, title, fee").in("id", cIds) : Promise.resolve({ data: [] }),
    ]);
    setStudents(new Map((ps ?? []).map((p: Student) => [p.id, p])));
    setCourses(new Map((cs ?? []).map((c: Course) => [c.id, c])));
  };

  useEffect(() => {
    load();
    supabase.from("profiles").select("id, full_name, email").order("full_name").then(({ data }) => setStudentList((data ?? []) as Student[]));
    supabase.from("courses").select("id, title, fee").order("title").then(({ data }) => setCourseList((data ?? []) as Course[]));
    supabase.from("enrollments").select("id, student_id, course_id, total_fee, discount_amount").then(({ data }) => setEnrollments((data ?? []) as Enrollment[]));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!s) return true;
      const p = students.get(r.student_id);
      const c = courses.get(r.course_id);
      return (
        p?.email.toLowerCase().includes(s) ||
        p?.full_name?.toLowerCase().includes(s) ||
        c?.title.toLowerCase().includes(s) ||
        r.receipt_number?.toLowerCase().includes(s) ||
        r.razorpay_order_id?.toLowerCase().includes(s)
      );
    });
  }, [rows, q, statusFilter, students, courses]);

  const totalRevenue = filtered.filter((r) => r.status === "completed").reduce((s, r) => s + Number(r.amount), 0);
  const pendingTotal = filtered.filter((r) => ["pending", "due", "partial"].includes(r.status)).reduce((s, r) => s + Number(r.amount), 0);

  const startNew = () => { setEdit(null); setForm(empty); setOpen(true); };
  const startEdit = (p: Payment) => {
    setEdit(p);
    setForm({
      student_id: p.student_id, course_id: p.course_id,
      amount: Number(p.amount), status: p.status,
      payment_method: p.payment_method ?? "cash", payment_type: p.payment_type,
      due_date: p.due_date ?? "", paid_at: p.paid_at?.slice(0, 10) ?? "",
      notes: p.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.student_id || !form.course_id || !form.amount) {
      return toast({ title: "Student, course and amount required", variant: "destructive" });
    }
    setBusy(true);
    const receiptNum = edit?.receipt_number ?? `RC-${Date.now().toString().slice(-8)}`;
    const payload = {
      student_id: form.student_id,
      course_id: form.course_id,
      amount: form.amount,
      currency: "INR",
      status: form.status,
      payment_method: form.payment_method,
      payment_type: form.payment_type,
      due_date: form.due_date || null,
      paid_at: form.paid_at ? new Date(form.paid_at).toISOString() : null,
      notes: form.notes || null,
      receipt_number: receiptNum,
    };
    const { error } = edit
      ? await supabase.from("payments").update(payload).eq("id", edit.id)
      : await supabase.from("payments").insert(payload);
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: edit ? "Payment updated" : "Payment recorded" });
    setOpen(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const downloadReceipt = (p: Payment) => {
    const s = students.get(p.student_id);
    const c = courses.get(p.course_id);
    const en = enrollments.find((e) => e.student_id === p.student_id && e.course_id === p.course_id);
    const totalPaid = rows.filter((r) => r.student_id === p.student_id && r.course_id === p.course_id && r.status === "completed").reduce((sum, r) => sum + Number(r.amount), 0);
    const totalFee = en ? Number(en.total_fee) - Number(en.discount_amount) : Number(c?.fee ?? 0);
    generateReceiptPdf({
      receiptNumber: p.receipt_number ?? p.id.slice(0, 8),
      date: new Date(p.paid_at ?? p.created_at).toLocaleDateString(),
      studentName: s?.full_name ?? "",
      studentEmail: s?.email ?? "",
      courseTitle: c?.title ?? "",
      lines: [{ description: `Payment for ${c?.title}`, amount: Number(p.amount) }],
      totalPaid: Number(p.amount),
      totalFee,
      outstanding: Math.max(0, totalFee - totalPaid),
      method: p.payment_method ?? undefined,
      notes: p.notes ?? undefined,
    });
  };

  const sendReminder = async (p: Payment) => {
    const s = students.get(p.student_id);
    const c = courses.get(p.course_id);
    if (!s?.email) return toast({ title: "No email on file", variant: "destructive" });
    try {
      await sendAdminEmail({
        to: s.email,
        subject: `Payment reminder: ${c?.title ?? "Course"}`,
        html: brandedEmail("Payment reminder", `<p>Hi ${s.full_name || "there"},</p><p>This is a reminder that ₹${Number(p.amount).toLocaleString("en-IN")} for <strong>${c?.title}</strong> is ${p.status === "due" ? "due" : "pending"}${p.due_date ? ` (due ${new Date(p.due_date).toLocaleDateString()})` : ""}.</p><p>Please complete the payment at your earliest convenience.</p>`),
        template: "payment_reminder",
        recipientId: s.id,
      });
      toast({ title: "Reminder sent" });
    } catch (e) {
      toast({ title: "Failed to send", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  };

  const openRefund = (p: Payment) => {
    setRefundOpen(p);
    setRefundAmount(Number(p.amount));
    setRefundReason("");
  };

  const submitRefund = async () => {
    if (!refundOpen) return;
    setBusy(true);
    const { error: refErr } = await supabase.from("refunds").insert({
      payment_id: refundOpen.id, amount: refundAmount, reason: refundReason || null,
    });
    if (refErr) { setBusy(false); return toast({ title: "Failed", description: refErr.message, variant: "destructive" }); }
    await supabase.from("payments").update({ status: "refunded" }).eq("id", refundOpen.id);
    setBusy(false);
    toast({ title: "Refund recorded" });
    setRefundOpen(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4"><p className="text-sm text-muted-foreground">Total records</p><p className="text-2xl font-bold">{filtered.length}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Revenue (completed)</p><p className="text-2xl font-bold flex items-center"><IndianRupee className="h-5 w-5" />{totalRevenue.toLocaleString("en-IN")}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted-foreground">Pending / Due</p><p className="text-2xl font-bold flex items-center"><IndianRupee className="h-5 w-5" />{pendingTotal.toLocaleString("en-IN")}</p></Card>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search student, course, receipt or order id" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="due">Due</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Receipt</th>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Method</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-right p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const p = students.get(r.student_id);
              const c = courses.get(r.course_id);
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{r.receipt_number ?? r.razorpay_order_id ?? "—"}</td>
                  <td className="p-3">
                    <div className="font-medium">{p?.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{p?.email}</div>
                  </td>
                  <td className="p-3">{c?.title || "—"}</td>
                  <td className="p-3 font-medium">₹{Number(r.amount).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-xs">{r.payment_method ?? r.payment_type}</td>
                  <td className="p-3"><Badge variant={r.status === "completed" ? "default" : r.status === "refunded" ? "outline" : "secondary"}>{r.status}</Badge></td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(r.paid_at ?? r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => downloadReceipt(r)} title="Download receipt"><Receipt className="h-3 w-3" /></Button>
                    {["pending", "due", "partial"].includes(r.status) && (
                      <Button size="sm" variant="ghost" onClick={() => sendReminder(r)} title="Send reminder"><Send className="h-3 w-3" /></Button>
                    )}
                    {r.status === "completed" && (
                      <Button size="sm" variant="ghost" onClick={() => openRefund(r)} title="Refund"><RotateCcw className="h-3 w-3" /></Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => startEdit(r)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-3 w-3" /></Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No payments.</td></tr>}
          </tbody>
        </table>
      </Card>

      {/* Record / edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{edit ? "Edit payment" : "Record payment"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Student</Label>
              <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{studentList.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name || s.email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course</Label>
              <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>{courseList.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Method</Label>
                <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.payment_type} onValueChange={(v) => setForm({ ...form, payment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full payment</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="installment">Installment</SelectItem>
                    <SelectItem value="manual">Manual entry</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Paid date</Label><Input type="date" value={form.paid_at} onChange={(e) => setForm({ ...form, paid_at: e.target.value })} /></div>
              <div><Label>Due date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{edit ? "Save" : "Record"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund */}
      <Dialog open={!!refundOpen} onOpenChange={(o) => !o && setRefundOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Refund payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Refund amount (₹)</Label><Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} /></div>
            <div><Label>Reason</Label><Textarea rows={2} value={refundReason} onChange={(e) => setRefundReason(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundOpen(null)}>Cancel</Button>
            <Button onClick={submitRefund} disabled={busy}>Process refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
