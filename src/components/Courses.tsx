import { useEffect, useState } from "react";
import CourseCard, { CourseStatus } from "./CourseCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCourseIcon } from "@/lib/courseIcons";
import { supabase } from "@/integrations/supabase/client";

const statusMap: Record<string, CourseStatus> = {
  open: "Open for Enrollment",
  coming_soon: "Coming Soon",
  closed: "Coming Soon",
};

type Row = {
  slug: string;
  title: string;
  description: string | null;
  duration: string | null;
  fee: number | null;
  original_fee: number | null;
  icon_name: string | null;
  status: string;
};

const Courses = () => {
  const navigate = useNavigate();
  const featuredSlugs = ["python", "sql", "snowflake", "power-bi", "data-analytics-projects", "data-science"];
  const [featured, setFeatured] = useState<(Row & { modulesCount: number })[]>([]);

  useEffect(() => {
    (async () => {
      const { data: courses } = await supabase
        .from("courses")
        .select("slug,title,description,duration,fee,original_fee,icon_name,status")
        .in("slug", featuredSlugs);
      const { data: mods } = await supabase
        .from("course_modules")
        .select("course_id, courses!inner(slug)");
      const counts: Record<string, number> = {};
      (mods ?? []).forEach((m: any) => {
        const slug = m.courses?.slug;
        if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
      });
      const byslug: Record<string, Row> = {};
      (courses ?? []).forEach((c: any) => (byslug[c.slug] = c));
      const ordered = featuredSlugs
        .map((s) => byslug[s])
        .filter(Boolean)
        .map((c) => ({ ...c, modulesCount: counts[c.slug] ?? 0 }));
      setFeatured(ordered);
    })();
  }, []);

  return (
    <section id="courses" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40" />
      <div className="blob bg-primary/20 w-[500px] h-[500px] -top-32 -right-32 animate-blob" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-block bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
            Course Catalog
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-4 mb-4 tracking-tight">
            Industry-ready <span className="gradient-text">curriculum</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Live cohorts in Python, Data Engineering, Data Analytics and Data Science — built with hiring managers.
          </p>
        </motion.div>

        <div
          id="pricing"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 max-w-7xl mx-auto"
        >
          {featured.map((course, index) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="h-full"
            >
              <CourseCard
                title={course.title}
                description={course.description ?? ""}
                price={course.fee}
                originalPrice={course.original_fee}
                duration={course.duration ?? ""}
                modulesCount={course.modulesCount}
                icon={getCourseIcon(course.icon_name ?? "BookOpen")}
                status={statusMap[course.status] ?? "Open for Enrollment"}
                syllabusPath={`/course/${course.slug}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button
            onClick={() => navigate("/courses")}
            size="lg"
            className="btn-gradient border-0 rounded-full h-12 px-8 font-semibold"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
