import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  MessageSquare,
  Video,
  Users,
  GraduationCap,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    webinars: 0,
    requests: 0,
    students: 0,
    enrollments: 0,
    revenue: 0,
  });
  const [recent, setRecent] = useState<{ id: string; name: string; submitted_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [c, w, r, s, e, p, rr] = await Promise.all([
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("webinars").select("id", { count: "exact", head: true }),
        supabase.from("consultation_requests").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("enrollments")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "completed"),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase
          .from("consultation_requests")
          .select("id, name, submitted_at")
          .order("submitted_at", { ascending: false })
          .limit(5),
      ]);
      const revenue = (p.data ?? []).reduce(
        (sum, row: { amount: number | string }) => sum + Number(row.amount ?? 0),
        0,
      );
      setStats({
        courses: c.count ?? 0,
        webinars: w.count ?? 0,
        requests: r.count ?? 0,
        students: s.count ?? 0,
        enrollments: e.count ?? 0,
        revenue,
      });
      setRecent(rr.data ?? []);
    })();
  }, []);

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users },
    { label: "Total Enrollments", value: stats.enrollments, icon: GraduationCap },
    {
      label: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    { label: "Total Courses", value: stats.courses, icon: BookOpen },
    { label: "Total Webinars", value: stats.webinars, icon: Video },
    { label: "Consultation Requests", value: stats.requests, icon: MessageSquare },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No requests yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li key={r.id} className="py-2 flex justify-between text-sm">
                  <span>{r.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(r.submitted_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
