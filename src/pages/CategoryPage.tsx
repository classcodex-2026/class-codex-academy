import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard, { CourseStatus } from "@/components/CourseCard";
import { getCourseIcon } from "@/lib/courseIcons";
import { supabase } from "@/integrations/supabase/client";

const CATEGORY_META: Record<string, { dbValue: string; name: string; tagline: string; description: string }> = {
  "python-programming": {
    dbValue: "python_programming",
    name: "Python Programming",
    tagline: "Master Python from fundamentals to real-world projects",
    description:
      "Learn the world's most versatile programming language with hands-on modules covering core Python, OOP, libraries and real-world projects.",
  },
  "data-engineering": {
    dbValue: "data_engineering",
    name: "Data Engineering",
    tagline: "Build modern, production-grade data platforms",
    description:
      "Master the entire data engineering stack — SQL, Python, warehousing, modelling and cloud platforms.",
  },
  "data-analytics": {
    dbValue: "data_analytics",
    name: "Data Analytics",
    tagline: "Turn raw data into business insights",
    description:
      "Career-ready analytics curriculum covering SQL, Excel, Power BI and real analytics projects.",
  },
  "data-science": {
    dbValue: "data_science",
    name: "Data Science",
    tagline: "Build models that solve real business problems",
    description:
      "Become a data scientist — Machine Learning, NLP, GenAI and applied real-world projects.",
  },
};

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

const CategoryPage = () => {
  const { slug } = useParams();
  const meta = slug ? CATEGORY_META[slug] : undefined;
  const [courses, setCourses] = useState<(Row & { modulesCount: number })[]>([]);

  useEffect(() => {
    if (!meta) return;
    (async () => {
      const { data } = await supabase
        .from("courses")
        .select("slug,title,description,duration,fee,original_fee,icon_name,status,sort_order")
        .eq("category", meta.dbValue as any)
        .order("sort_order");
      const { data: mods } = await supabase
        .from("course_modules")
        .select("course_id, courses!inner(slug)");
      const counts: Record<string, number> = {};
      (mods ?? []).forEach((m: any) => {
        const s = m.courses?.slug;
        if (s) counts[s] = (counts[s] ?? 0) + 1;
      });
      setCourses((data ?? []).map((c: any) => ({ ...c, modulesCount: counts[c.slug] ?? 0 })));
    })();
  }, [meta]);

  if (!meta) return <Navigate to="/courses" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Course Category
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2 mb-4">
              {meta.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">{meta.tagline}</p>
            <p className="text-muted-foreground">{meta.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {courses.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
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
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
