import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import CourseSyllabusPage, { CourseSyllabusData } from "@/components/CourseSyllabusPage";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const statusMap: Record<string, CourseSyllabusData["status"]> = {
  open: "Open for Enrollment",
  coming_soon: "Coming Soon",
  closed: "Coming Soon",
};

const CoursePage = () => {
  const { slug } = useParams();
  const [data, setData] = useState<CourseSyllabusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!course) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data: mods } = await supabase
        .from("course_modules")
        .select("title, topics")
        .eq("course_id", course.id)
        .order("sort_order");
      setData({
        name: course.title,
        tagline: course.tagline ?? "",
        overview: course.overview ?? course.description ?? "",
        duration: course.duration ?? "",
        modulesCount: (mods ?? []).length,
        projectsCount: ((course.projects as string[]) ?? []).length,
        status: statusMap[course.status] ?? "Open for Enrollment",
        price: course.fee,
        originalPrice: course.original_fee,
        outcomes: (course.outcomes as string[]) ?? [],
        prerequisites: (course.prerequisites as string[]) ?? [],
        projects: (course.projects as string[]) ?? [],
        certification: course.certification ?? "",
        modules: (mods ?? []).map((m: any) => ({
          title: m.title,
          topics: (m.topics as string[]) ?? [],
        })),
        faqs: ((course.faqs as { q: string; a: string }[]) ?? []).length
          ? (course.faqs as { q: string; a: string }[])
          : [
              { q: "Who is this course for?", a: `Anyone serious about building a career around ${course.title}. Beginners and working professionals are both welcome.` },
              { q: "Will I get a certificate?", a: "Yes — a verifiable course completion certificate is issued at the end of the program." },
              { q: "Is there job assistance?", a: "We provide resume reviews, mock interviews and curated job referrals based on availability." },
              { q: "How do I enroll?", a: "Click the Enroll via WhatsApp button and our team will share fees, batch dates and next steps." },
            ],
      });
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (notFound || !data) return <Navigate to="/courses" replace />;
  return <CourseSyllabusPage data={data} />;
};

export default CoursePage;
