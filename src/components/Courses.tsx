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
    <section id="courses" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-primary/10 blur-[150px]"
        animate={{ x: [-50, 50, -50], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Course Catalog
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Industry-Ready <span className="text-gradient">Curriculum</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore featured courses across Python, Data Engineering, Data Analytics and Data Science.
          </p>
        </motion.div>

        <div
          id="pricing"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {featured.map((course, index) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
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

        <div className="text-center mt-12">
          <Button
            onClick={() => navigate("/courses")}
            size="lg"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
          >
            View All Courses
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
