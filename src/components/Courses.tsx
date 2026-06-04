import CourseCard from "./CourseCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getAllCourses } from "@/data/courses";
import { getCourseIcon } from "@/lib/courseIcons";

const Courses = () => {
  const navigate = useNavigate();
  // Show a curated subset on the homepage (one flagship per category) for a clean grid
  const featuredSlugs = ["python", "snowflake", "sql-analytics", "ml-fundamentals", "ethical-hacking", "de-projects"];
  const all = getAllCourses();
  const featured = featuredSlugs
    .map((s) => all.find((c) => c.slug === s))
    .filter(Boolean) as ReturnType<typeof getAllCourses>;

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
            Explore featured courses across Python, Data Engineering, Analytics, Data Science and Cyber Security.
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
                description={course.description}
                price={course.price ?? null}
                originalPrice={course.originalPrice ?? null}
                duration={course.duration}
                modulesCount={course.modulesCount}
                icon={getCourseIcon(course.iconName)}
                status={course.status}
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
