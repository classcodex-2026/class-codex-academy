import { useEffect, useState } from "react";
import StudentLayout from "@/components/student/StudentLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, pending: 0 });
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: enrolls }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase.from("enrollments").select("payment_status").eq("student_id", user.id),
      ]);
      setName(profile?.full_name || user.email?.split("@")[0] || "Student");
      const list = enrolls ?? [];
      setStats({
        enrolled: list.filter((e) => e.payment_status === "completed").length,
        completed: 0,
        pending: list.filter((e) => e.payment_status === "pending").length,
      });
    })();
  }, [user]);

  const cards = [
    { label: "Enrolled Courses", value: stats.enrolled, icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
    { label: "Pending Payments", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {name} 👋</h1>
          <p className="text-muted-foreground">Continue your learning journey.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{c.value}</div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
