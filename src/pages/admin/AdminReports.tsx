import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText } from "lucide-react";

type Profile = { id: string; full_name: string; email: string; status: string; created_at: string };
type Enrollment = { id: string; student_id: string; course_id: string; total_fee: number; discount_amount: number; enrolled_at: string };
type Payment = { id: string; student_id: string; course_id: string; amount: number; status: string; created_at: string; due_date: string | null };
type Course = { id: string; title: string; fee: number | null };

export default function AdminReports() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [from, setFrom] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("id, full_name, email, status, created_at"),
      supabase.from("enrollments").select("id, student_id, course_id, total_fee, discount_amount, enrolled_at"),
      supabase.from("payments").select("id, student_id, course_id, amount, status, created_at, due_date"),
      supabase.from("courses").select("id, title, fee"),
    ]).then(([p, e, py, c]) => {
      setProfiles((p.data ?? []) as Profile[]);
      setEnrollments((e.data ?? []) as Enrollment[]);
      setPayments((py.data ?? []) as Payment[]);
      setCourses((c.data ?? []) as Course[]);
    });
  }, []);

  const inRange = (d: string) => d >= from && d <= to + "T23:59:59";
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));
  const profMap = new Map(profiles.map((p) => [p.id, p]));

  // Revenue
  const revenuePayments = payments.filter((p) => p.status === "completed" && inRange(p.created_at));
  const totalRevenue = revenuePayments.reduce((s, p) => s + Number(p.amount), 0);

  // Course-wise revenue
  const revByCourse: Record<string, number> = {};
  revenuePayments.forEach((p) => { revByCourse[p.course_id] = (revByCourse[p.course_id] ?? 0) + Number(p.amount); });

  // Monthly revenue
  const revByMonth: Record<string, number> = {};
  revenuePayments.forEach((p) => {
    const k = p.created_at.slice(0, 7);
    revByMonth[k] = (revByMonth[k] ?? 0) + Number(p.amount);
  });

  // Dues — per enrollment outstanding
  const paidByPair: Record<string, number> = {};
  payments.filter((p) => p.status === "completed").forEach((p) => {
    const k = `${p.student_id}:${p.course_id}`;
    paidByPair[k] = (paidByPair[k] ?? 0) + Number(p.amount);
  });
  const dues = enrollments.map((e) => {
    const paid = paidByPair[`${e.student_id}:${e.course_id}`] ?? 0;
    const due = Math.max(0, Number(e.total_fee) - Number(e.discount_amount) - paid);
    return { ...e, paid, due };
  }).filter((d) => d.due > 0);
  const totalDues = dues.reduce((s, d) => s + d.due, 0);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = payments.filter((p) => ["pending", "due", "partial"].includes(p.status) && p.due_date && p.due_date < today);

  const exportXlsx = (sheetName: string, data: Record<string, unknown>[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPdf = (title: string, head: string[], body: (string | number)[][]) => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255); doc.setFontSize(16);
    doc.text(`ClassCodex · ${title}`, 14, 14);
    autoTable(doc, { startY: 30, head: [head], body, headStyles: { fillColor: [37, 99, 235] } });
    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="flex gap-3 mb-6 items-end flex-wrap">
        <div><label className="text-xs text-muted-foreground">From</label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground">To</label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Revenue (range)</p><p className="text-2xl font-bold">₹{totalRevenue.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Outstanding dues</p><p className="text-2xl font-bold">₹{totalDues.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Overdue payments</p><p className="text-2xl font-bold">{overdue.length}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active students</p><p className="text-2xl font-bold">{profiles.filter((p) => p.status === "active").length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="dues">Pending Dues</TabsTrigger>
          <TabsTrigger value="course">Course Revenue</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Student report</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => exportXlsx("Students", profiles.map((p) => ({ Name: p.full_name, Email: p.email, Status: p.status, Joined: p.created_at.slice(0, 10) })))}><Download className="h-3 w-3 mr-1" />Excel</Button>
                <Button size="sm" variant="outline" onClick={() => exportPdf("Students", ["Name", "Email", "Status", "Joined"], profiles.map((p) => [p.full_name, p.email, p.status, p.created_at.slice(0, 10)]))}><FileText className="h-3 w-3 mr-1" />PDF</Button>
              </div>
            </CardHeader>
            <CardContent><ReportTable head={["Name", "Email", "Status", "Joined"]} rows={profiles.slice(0, 100).map((p) => [p.full_name, p.email, <Badge key="s" variant="secondary">{p.status}</Badge>, p.created_at.slice(0, 10)])} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Enrollment report</CardTitle>
              <Button size="sm" variant="outline" onClick={() => exportXlsx("Enrollments", enrollments.map((e) => ({ Student: profMap.get(e.student_id)?.email ?? "", Course: courseMap.get(e.course_id) ?? "", Fee: e.total_fee, Discount: e.discount_amount, Date: e.enrolled_at.slice(0, 10) })))}><Download className="h-3 w-3 mr-1" />Excel</Button>
            </CardHeader>
            <CardContent><ReportTable head={["Student", "Course", "Fee", "Discount", "Date"]} rows={enrollments.slice(0, 100).map((e) => [profMap.get(e.student_id)?.email ?? "—", courseMap.get(e.course_id) ?? "—", `₹${e.total_fee}`, `₹${e.discount_amount}`, e.enrolled_at.slice(0, 10)])} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Revenue report</CardTitle>
              <Button size="sm" variant="outline" onClick={() => exportXlsx("Revenue", revenuePayments.map((p) => ({ Date: p.created_at.slice(0, 10), Student: profMap.get(p.student_id)?.email ?? "", Course: courseMap.get(p.course_id) ?? "", Amount: p.amount })))}><Download className="h-3 w-3 mr-1" />Excel</Button>
            </CardHeader>
            <CardContent><ReportTable head={["Date", "Student", "Course", "Amount"]} rows={revenuePayments.slice(0, 100).map((p) => [p.created_at.slice(0, 10), profMap.get(p.student_id)?.email ?? "—", courseMap.get(p.course_id) ?? "—", `₹${Number(p.amount).toLocaleString("en-IN")}`])} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dues">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Pending dues</CardTitle>
              <Button size="sm" variant="outline" onClick={() => exportXlsx("Dues", dues.map((d) => ({ Student: profMap.get(d.student_id)?.email ?? "", Course: courseMap.get(d.course_id) ?? "", Fee: d.total_fee, Paid: d.paid, Outstanding: d.due })))}><Download className="h-3 w-3 mr-1" />Excel</Button>
            </CardHeader>
            <CardContent><ReportTable head={["Student", "Course", "Fee", "Paid", "Outstanding"]} rows={dues.map((d) => [profMap.get(d.student_id)?.email ?? "—", courseMap.get(d.course_id) ?? "—", `₹${d.total_fee}`, `₹${d.paid}`, `₹${d.due}`])} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course">
          <Card>
            <CardHeader><CardTitle>Course-wise revenue</CardTitle></CardHeader>
            <CardContent><ReportTable head={["Course", "Revenue"]} rows={Object.entries(revByCourse).sort((a, b) => b[1] - a[1]).map(([cid, amt]) => [courseMap.get(cid) ?? "—", `₹${amt.toLocaleString("en-IN")}`])} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader><CardTitle>Monthly collection</CardTitle></CardHeader>
            <CardContent><ReportTable head={["Month", "Collected"]} rows={Object.entries(revByMonth).sort().map(([m, amt]) => [m, `₹${amt.toLocaleString("en-IN")}`])} /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

function ReportTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>{head.map((h, i) => <th key={i} className="text-left p-2">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="p-2">{c}</td>)}</tr>)}
          {rows.length === 0 && <tr><td colSpan={head.length} className="p-4 text-center text-muted-foreground">No data</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
