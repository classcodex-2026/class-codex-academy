import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  fee: number | null;
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("id, slug, title, category, status, fee, sort_order")
      .order("sort_order");
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setCourses(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course and all its modules/videos?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Course deleted" });
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button asChild>
          <Link to="/admin/courses/new">
            <Plus className="h-4 w-4 mr-1" /> Add Course
          </Link>
        </Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Fee</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No courses yet.</td></tr>
            ) : (
              courses.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3 text-muted-foreground">{c.category.replace(/_/g, " ")}</td>
                  <td className="p-3">
                    <Badge variant={c.status === "open" ? "default" : "secondary"}>
                      {c.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-3">{c.fee ? `₹${c.fee}` : "—"}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/admin/courses/${c.id}`}><Pencil className="h-3 w-3" /></Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}
