import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { getAllCourses } from "@/data/courses";
import { getCourseIcon } from "@/lib/courseIcons";

const AllCourses = () => {
  const all = getAllCourses();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Full Catalog
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-2 mb-4">
              All Courses
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse every course across Python, Data Engineering, Data Analytics and Data Science.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {all.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
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
      </section>
      <Footer />
    </div>
  );
};

export default AllCourses;
