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
import { Trash2, Plus, Search } from "lucide-react";

type Row = {
  id: string;
  student_id: string;
  course_id: string;
  payment_status: string;
  enrolled_at: string;
  profiles?: { full_name: string; email: string } | null;
  courses?: { title: string } | null;
};
type Student = { id: string; email: string; full_name: string };
type Course = { id: string; title: string };

export default function AdminEnrollments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("enrollments")
      .select("id, student_id, course_id, payment_status, enrolled_at")
      .order("enrolled_at", { ascending: false });
    const list = (data ?? []) as Omit<Row, "profiles" | "courses">[];
    const studentIds = [...new Set(list.map((r) => r.student_id))];
    const courseIds = [...new Set(list.map((r) => r.course_id))];
    const [{ data: ps }, { data: cs }] = await Promise.all([
      studentIds.length
        ? supabase.from("profiles").select("id, full_name, email").in("id", studentIds)
        : Promise.resolve({ data: [] as { id: string; full_name: string; email: string }[] }),
      courseIds.length
        ? supabase.from("courses").select("id, title").in("id", courseIds)
        : Promise.resolve({ data: [] as { id: string; title: string }[] }),
    ]);
    const pMap = new Map((ps ?? []).map((p) => [p.id, p]));
    const cMap = new Map((cs ?? []).map((c) => [c.id, c]));
    setRows(
      list.map((r) => ({
        ...r,
        profiles: pMap.get(r.student_id)
          ? { full_name: pMap.get(r.student_id)!.full_name, email: pMap.get(r.student_id)!.email }
          : null,
        courses: cMap.get(r.course_id) ? { title: cMap.get(r.course_id)!.title } : null,
      })),
    );
  };

  useEffect(() => {
    load();
    supabase
      .from("profiles")
      .select("id, email, full_name")
      .order("created_at", { ascending: false })
      .then(({ data }) => setStudents((data ?? []) as Student[]));
    supabase
      .from("courses")
      .select("id, title")
      .order("title")
      .then(({ data }) => setCourses((data ?? []) as Course[]));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.profiles?.email.toLowerCase().includes(s) ||
        r.profiles?.full_name?.toLowerCase().includes(s) ||
        r.courses?.title?.toLowerCase().includes(s),
    );
  }, [rows, q]);

  const del = async (id: string) => {
    if (!confirm("Remove this enrollment?")) return;
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Enrollment removed" });
    load();
  };

  const create = async () => {
    if (!studentId || !courseId) return;
    setBusy(true);
    const { error } = await supabase
      .from("enrollments")
      .insert({ student_id: studentId, course_id: courseId, payment_status: "completed" });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Enrollment created" });
    setOpen(false);
    setStudentId("");
    setCourseId("");
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold">Enrollments</h1>
        <div className="flex gap-2 items-center w-full max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student or course"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Student</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Course</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Date</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.profiles?.full_name || "—"}</td>
                <td className="p-3">{r.profiles?.email || "—"}</td>
                <td className="p-3">{r.courses?.title || "—"}</td>
                <td className="p-3">
                  <Badge variant={r.payment_status === "completed" ? "default" : "secondary"}>
                    {r.payment_status}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(r.enrolled_at).toLocaleString()}
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => del(r.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No enrollments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.full_name ? `${s.full_name} — ${s.email}` : s.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={!studentId || !courseId || busy}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
