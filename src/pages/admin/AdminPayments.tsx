import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, IndianRupee } from "lucide-react";

type Row = {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  created_at: string;
};

export default function AdminPayments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [students, setStudents] = useState<Map<string, { full_name: string; email: string }>>(new Map());
  const [courses, setCourses] = useState<Map<string, string>>(new Map());
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      const list = (data ?? []) as Row[];
      setRows(list);
      const sIds = [...new Set(list.map((r) => r.student_id))];
      const cIds = [...new Set(list.map((r) => r.course_id))];
      const [{ data: ps }, { data: cs }] = await Promise.all([
        sIds.length
          ? supabase.from("profiles").select("id, full_name, email").in("id", sIds)
          : Promise.resolve({ data: [] as { id: string; full_name: string; email: string }[] }),
        cIds.length
          ? supabase.from("courses").select("id, title").in("id", cIds)
          : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      ]);
      setStudents(new Map((ps ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])));
      setCourses(new Map((cs ?? []).map((c) => [c.id, c.title])));
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const p = students.get(r.student_id);
      const c = courses.get(r.course_id);
      return (
        p?.email.toLowerCase().includes(s) ||
        p?.full_name?.toLowerCase().includes(s) ||
        c?.toLowerCase().includes(s) ||
        r.razorpay_order_id.toLowerCase().includes(s) ||
        r.razorpay_payment_id?.toLowerCase().includes(s)
      );
    });
  }, [rows, q, students, courses]);

  const revenue = filtered
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student, course or order id"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Payments shown</p>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Completed revenue</p>
          <p className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5" />
            {revenue.toLocaleString("en-IN")}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending / Failed</p>
          <p className="text-2xl font-bold">
            {filtered.filter((r) => r.status !== "completed").length}
          </p>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Order ID</th>
              <th className="text-left p-3">Payment ID</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const p = students.get(r.student_id);
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{p?.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{p?.email || "—"}</div>
                  </td>
                  <td className="p-3">{courses.get(r.course_id) || "—"}</td>
                  <td className="p-3 font-medium">
                    {r.currency} {Number(r.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <Badge variant={r.status === "completed" ? "default" : "secondary"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{r.razorpay_order_id}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {r.razorpay_payment_id ?? "—"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No payments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
