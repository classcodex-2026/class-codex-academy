import { useEffect, useMemo, useState } from "react";
import StudentLayout from "@/components/student/StudentLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type Course = {
  id: string; slug: string; title: string; tagline: string | null;
  fee: number | null; banner_url: string | null; status: string;
};

const BrowseCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, slug, title, tagline, fee, banner_url, status")
        .eq("status", "open")
        .order("sort_order");
      setCourses((data as any) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    return t ? courses.filter((c) => c.title.toLowerCase().includes(t) || c.tagline?.toLowerCase().includes(t)) : courses;
  }, [q, courses]);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">Browse Courses</h1>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <Card key={c.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  {c.banner_url ? (
                    <img src={c.banner_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-primary" />
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{c.tagline}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="font-bold text-primary">
                      {c.fee ? `₹${c.fee.toLocaleString()}` : "Free"}
                    </div>
                    <Button asChild size="sm"><Link to={`/checkout/${c.id}`}>Enroll Now</Link></Button>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link to={`/course/${c.slug}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-12">No courses match your search.</p>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default BrowseCourses;
