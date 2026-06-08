import { useEffect, useState } from "react";
import StudentLayout from "@/components/student/StudentLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";

type Row = {
  id: string;
  enrolled_at: string;
  payment_status: string;
  courses: { id: string; slug: string; title: string; banner_url: string | null; tagline: string | null } | null;
};

const MyCourses = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, enrolled_at, payment_status, courses(id, slug, title, banner_url, tagline)")
        .eq("student_id", user.id)
        .order("enrolled_at", { ascending: false });
      setRows((data as any) ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Courses</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : rows.length === 0 ? (
          <Card><CardContent className="py-16 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Button asChild><Link to="/dashboard/browse">Browse Courses</Link></Button>
          </CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((r) => (
              <Card key={r.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  {r.courses?.banner_url ? (
                    <img src={r.courses.banner_url} alt={r.courses.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-primary" />
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2">{r.courses?.title}</h3>
                    <Badge variant={r.payment_status === "completed" ? "default" : "secondary"}>
                      {r.payment_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled {new Date(r.enrolled_at).toLocaleDateString()}
                  </p>
                  {r.payment_status === "completed" ? (
                    <Button asChild className="w-full" size="sm">
                      <Link to={`/dashboard/learn/${r.courses?.id}`}>Continue Learning</Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full" size="sm" variant="outline">
                      <Link to={`/checkout/${r.courses?.id}`}>Complete Payment</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default MyCourses;
