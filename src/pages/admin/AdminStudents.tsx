import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Eye, Trash2, Plus, Search } from "lucide-react";

type Profile = { id: string; email: string; full_name: string; created_at: string };
type Course = { id: string; title: string; fee: number | null };
type Enrollment = {
  id: string;
  course_id: string;
  payment_status: string;
  enrolled_at: string;
  courses?: { title: string } | null;
};
type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  created_at: string;
  courses?: { title: string } | null;
};

export default function AdminStudents() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [view, setView] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [pickedCourse, setPickedCourse] = useState<string>("");
  const [busy, setBusy] = useState(false);

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
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter(
      (u) =>
        u.email.toLowerCase().includes(s) ||
        (u.full_name ?? "").toLowerCase().includes(s),
    );
  }, [q, students]);

  const openProfile = async (p: Profile) => {
    setView(p);
    setEnrollments([]);
    setPayments([]);
    const [{ data: en }, { data: py }] = await Promise.all([
      supabase
        .from("enrollments")
        .select("id, course_id, payment_status, enrolled_at, courses(title)")
        .eq("student_id", p.id)
        .order("enrolled_at", { ascending: false }),
      supabase
        .from("payments")
        .select(
          "id, amount, currency, status, razorpay_order_id, razorpay_payment_id, created_at, courses(title)",
        )
        .eq("student_id", p.id)
        .order("created_at", { ascending: false }),
    ]);
    setEnrollments((en ?? []) as Enrollment[]);
    setPayments((py ?? []) as Payment[]);
  };

  const removeEnrollment = async (id: string) => {
    if (!confirm("Remove this enrollment? Student will lose access to the course.")) return;
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Enrollment removed" });
    if (view) openProfile(view);
    load();
  };

  const enrollNow = async () => {
    if (!view || !pickedCourse) return;
    setBusy(true);
    const { error } = await supabase.from("enrollments").insert({
      student_id: view.id,
      course_id: pickedCourse,
      payment_status: "completed",
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Student enrolled" });
    setEnrollOpen(false);
    setPickedCourse("");
    openProfile(view);
    load();
  };

  const enrolledIds = new Set(enrollments.map((e) => e.course_id));
  const availableCourses = courses.filter((c) => !enrolledIds.has(c.id));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Joined</th>
              <th className="text-left p-3">Enrollments</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-medium">{u.full_name || "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Badge variant="secondary">{counts[u.id] ?? 0}</Badge>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => openProfile(u)}>
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{view?.full_name || view?.email}</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{view.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Joined</p>
                  <p className="font-medium">{new Date(view.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Enrollments ({enrollments.length})</h3>
                  <Button size="sm" onClick={() => setEnrollOpen(true)}>
                    <Plus className="h-3 w-3 mr-1" /> Enroll in course
                  </Button>
                </div>
                <div className="border border-border rounded">
                  <table className="w-full">
                    <thead className="bg-muted/40 text-xs">
                      <tr>
                        <th className="text-left p-2">Course</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-right p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((e) => (
                        <tr key={e.id} className="border-t border-border">
                          <td className="p-2">{e.courses?.title ?? "—"}</td>
                          <td className="p-2">
                            <Badge
                              variant={e.payment_status === "completed" ? "default" : "secondary"}
                            >
                              {e.payment_status}
                            </Badge>
                          </td>
                          <td className="p-2 text-muted-foreground">
                            {new Date(e.enrolled_at).toLocaleDateString()}
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeEnrollment(e.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {enrollments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-muted-foreground">
                            No enrollments.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payments ({payments.length})</h3>
                <div className="border border-border rounded">
                  <table className="w-full">
                    <thead className="bg-muted/40 text-xs">
                      <tr>
                        <th className="text-left p-2">Course</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-t border-border">
                          <td className="p-2">{p.courses?.title ?? "—"}</td>
                          <td className="p-2">
                            {p.currency} {Number(p.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="p-2">
                            <Badge variant={p.status === "completed" ? "default" : "secondary"}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-xs text-muted-foreground">
                            {p.razorpay_order_id}
                          </td>
                          <td className="p-2 text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-3 text-center text-muted-foreground">
                            No payments.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manually enroll student</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Grants {view?.email} immediate access to the selected course (marked as completed).
            </p>
            <Select value={pickedCourse} onValueChange={setPickedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
                {availableCourses.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    Already enrolled in all courses.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollOpen(false)}>
              Cancel
            </Button>
            <Button onClick={enrollNow} disabled={!pickedCourse || busy}>
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
