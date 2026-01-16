import CourseCard from "./CourseCard";
import { Database, Code, Snowflake, BarChart3 } from "lucide-react";

const courses = [
  {
    title: "Database & SQL",
    description: "Master database fundamentals and SQL queries for data management and analysis.",
    price: 999,
    duration: "6 Weeks",
    icon: <Database className="w-7 h-7 text-primary" />,
    syllabus: [
      "Introduction to Databases & RDBMS",
      "SQL Fundamentals - SELECT, WHERE, ORDER BY",
      "Joins - INNER, LEFT, RIGHT, FULL",
      "Aggregate Functions & GROUP BY",
      "Subqueries & CTEs",
      "Database Design & Normalization",
      "Indexing & Query Optimization",
      "Stored Procedures & Functions",
      "Real-world Projects & Case Studies",
    ],
  },
  {
    title: "Python Programming",
    description: "Learn Python from basics to advanced with focus on data analysis and automation.",
    price: 1499,
    duration: "8 Weeks",
    icon: <Code className="w-7 h-7 text-primary" />,
    popular: true,
    syllabus: [
      "Python Basics - Variables, Data Types",
      "Control Flow & Loops",
      "Functions & Modules",
      "Object-Oriented Programming",
      "File Handling & Exception Handling",
      "NumPy for Numerical Computing",
      "Pandas for Data Analysis",
      "Data Visualization with Matplotlib",
      "API Integration & Web Scraping",
      "Capstone Projects",
    ],
  },
  {
    title: "Snowflake",
    description: "Cloud data warehousing with Snowflake - from basics to advanced analytics.",
    price: 2999,
    duration: "6 Weeks",
    icon: <Snowflake className="w-7 h-7 text-primary" />,
    syllabus: [
      "Introduction to Cloud Data Warehousing",
      "Snowflake Architecture & Concepts",
      "Data Loading & Unloading",
      "Working with Stages & File Formats",
      "Time Travel & Data Sharing",
      "Snowpipe & Continuous Data Loading",
      "Performance Optimization",
      "Snowflake Security & Access Control",
      "Integration with BI Tools",
    ],
  },
  {
    title: "Power BI",
    description: "Create stunning dashboards and reports with Microsoft Power BI for business intelligence.",
    price: 599,
    duration: "4 Weeks",
    icon: <BarChart3 className="w-7 h-7 text-primary" />,
    syllabus: [
      "Introduction to Business Intelligence",
      "Power BI Desktop Overview",
      "Connecting to Data Sources",
      "Data Transformation with Power Query",
      "DAX Fundamentals",
      "Creating Visualizations & Charts",
      "Building Interactive Dashboards",
      "Publishing & Sharing Reports",
      "Power BI Service & Collaboration",
    ],
  },
];

const Courses = () => {
  return (
    <section id="courses" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Courses</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Industry-Ready Curriculum
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed courses to build skills that employers are looking for.
          </p>
        </div>
        
        <div id="pricing" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
