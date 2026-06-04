import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { categories } from "@/data/courses";
import { getCourseIcon } from "@/lib/courseIcons";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return <Navigate to="/courses" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
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
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">{category.tagline}</p>
            <p className="text-muted-foreground">{category.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {category.courses.map((course, i) => (
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

export default CategoryPage;
