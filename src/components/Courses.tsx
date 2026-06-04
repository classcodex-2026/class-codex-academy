import CourseCard, { CourseStatus } from "./CourseCard";
import { Database, Code, Snowflake, BarChart3, Cloud } from "lucide-react";
import { motion } from "framer-motion";

interface CourseDef {
  title: string;
  description: string;
  price: number | null;
  originalPrice?: number | null;
  duration: string;
  modulesCount: number;
  icon: React.ReactNode;
  status: CourseStatus;
  syllabusPath: string;
}

const courses: CourseDef[] = [
  {
    title: "AWS Data Engineering",
    description:
      "Master cloud data engineering with AWS — from foundations to production-ready batch and streaming pipelines.",
    price: null,
    originalPrice: null,
    duration: "150 Hours",
    modulesCount: 14,
    icon: <Cloud className="w-8 h-8 text-primary" />,
    status: "Coming Soon",
    syllabusPath: "/course/data-engineering",
  },
  {
    title: "Database & SQL",
    description:
      "Master database fundamentals and advanced SQL for analytics, reporting and real-world data systems.",
    price: 999,
    originalPrice: 3999,
    duration: "8 Hours",
    modulesCount: 9,
    icon: <Database className="w-8 h-8 text-primary" />,
    status: "New Batch Starting",
    syllabusPath: "/course/sql",
  },
  {
    title: "Python Programming",
    description:
      "Learn Python from basics to advanced — focused on data analysis, automation and a hands-on mini project.",
    price: 999,
    originalPrice: 4999,
    duration: "8 Hours",
    modulesCount: 7,
    icon: <Code className="w-8 h-8 text-primary" />,
    status: "Open for Enrollment",
    syllabusPath: "/course/python",
  },
  {
    title: "Snowflake",
    description:
      "Cloud data warehousing with Snowflake — architecture, loading, performance, security and BI integration.",
    price: 2999,
    originalPrice: 8000,
    duration: "6 Weeks",
    modulesCount: 9,
    icon: <Snowflake className="w-8 h-8 text-primary" />,
    status: "New Batch Starting",
    syllabusPath: "/course/snowflake",
  },
  {
    title: "Power BI",
    description:
      "Create stunning dashboards and reports with Microsoft Power BI for modern business intelligence.",
    price: 999,
    originalPrice: 3999,
    duration: "4 Weeks",
    modulesCount: 9,
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    status: "Open for Enrollment",
    syllabusPath: "/course/powerbi",
  },
];

const Courses = () => {
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
            Choose from carefully designed courses to build the in-demand skills
            employers are looking for.
          </p>
        </motion.div>

        <div
          id="pricing"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
