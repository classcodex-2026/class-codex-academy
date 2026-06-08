import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Download, Save } from "lucide-react";

type Status = "present" | "absent" | "late" | "excused";
type Batch = { id: string; name: string; course_id: string };
type Student = { id: string; full_name: string; email: string };
type Att = { id: string; student_id: string; date: string; status: Status; notes: string | null };

export default function AdminAttendance() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, Status>>({});
  const [history, setHistory] = useState<Att[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("batches").select("id, name, course_id").order("name").then(({ data }) => setBatches((data ?? []) as Batch[]));
  }, []);

  useEffect(() => {
    if (!batchId) return;
    (async () => {
      const { data: ens } = await supabase.from("enrollments").select("student_id").eq("batch_id", batchId);
      const sids = (ens ?? []).map((e: { student_id: string }) => e.student_id);
      if (!sids.length) { setStudents([]); setMarks({}); setHistory([]); return; }
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", sids);
      setStudents((profs ?? []) as Student[]);
      const { data: today } = await supabase.from("attendance").select("student_id, status").eq("batch_id", batchId).eq("date", date);
      const m: Record<string, Status> = {};
      (today ?? []).forEach((a: { student_id: string; status: Status }) => { m[a.student_id] = a.status; });
      sids.forEach((id) => { if (!m[id]) m[id] = "present"; });
      setMarks(m);
      const { data: hist } = await supabase.from("attendance").select("*").eq("batch_id", batchId).order("date", { ascending: false }).limit(500);
      setHistory((hist ?? []) as Att[]);
    })();
  }, [batchId, date]);

  const save = async () => {
    if (!batchId) return;
    setBusy(true);
    const rows = students.map((s) => ({
      batch_id: batchId, student_id: s.id, date, status: marks[s.id] ?? "present",
    }));
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "batch_id,student_id,date" });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Attendance saved" });
    const { data: hist } = await supabase.from("attendance").select("*").eq("batch_id", batchId).order("date", { ascending: false }).limit(500);
    setHistory((hist ?? []) as Att[]);
  };

  const percentage = useMemo(() => {
    const byStudent: Record<string, { total: number; present: number }> = {};
    history.forEach((h) => {
      byStudent[h.student_id] ??= { total: 0, present: 0 };
      byStudent[h.student_id].total += 1;
      if (h.status === "present" || h.status === "late") byStudent[h.student_id].present += 1;
    });
    return byStudent;
  }, [history]);

  const exportReport = () => {
    const rows = students.map((s) => {
      const p = percentage[s.id];
      const pct = p ? Math.round((p.present / p.total) * 100) : 0;
      return { Student: s.full_name, Email: s.email, Sessions: p?.total ?? 0, Present: p?.present ?? 0, "%": pct };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `attendance-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      <div className="flex gap-3 mb-4 flex-wrap">
        <Select value={batchId} onValueChange={setBatchId}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Pick a batch" /></SelectTrigger>
          <SelectContent>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48" />
        <Button onClick={save} disabled={!batchId || busy}><Save className="h-4 w-4 mr-1" /> Save</Button>
        <Button variant="outline" onClick={exportReport} disabled={!students.length}><Download className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      {!batchId ? (
        <Card className="p-8 text-center text-muted-foreground">Select a batch to mark attendance.</Card>
      ) : students.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No students enrolled in this batch.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-3">Student</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const p = percentage[s.id];
                const pct = p ? Math.round((p.present / p.total) * 100) : 0;
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-3">
                      <div className="font-medium">{s.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="p-3">
                      <Select value={marks[s.id] ?? "present"} onValueChange={(v) => setMarks({ ...marks, [s.id]: v as Status })}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Badge variant={pct >= 75 ? "default" : "secondary"}>{pct}% ({p?.present ?? 0}/{p?.total ?? 0})</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </AdminLayout>
  );
}
