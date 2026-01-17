import CourseCard from "./CourseCard";
import { Database, Code, Snowflake, BarChart3, Cloud } from "lucide-react";

const courses = [
  {
    title: "AWS Data Engineering",
    description: "Master cloud data engineering with AWS - from foundations to production-ready pipelines.",
    price: null,
    duration: "150 Hours",
    icon: <Cloud className="w-7 h-7 text-primary" />,
    popular: true,
    comingSoon: true,
    syllabus: [
      "Module 1: Data Engineering Foundations - Role, Lifecycle, ETL vs ELT",
      "Module 2: SQL Fundamentals to Advanced - JOINs, Window Functions, Performance Tuning",
      "Module 3: AWS Cloud Fundamentals & IAM - Users, Roles, Policies, CLI Setup",
      "Module 4: AWS Storage - S3 Buckets, Partitioning, Lifecycle Rules",
      "Module 5: Compute & Serverless - Lambda, Event-Driven Pipelines, Monitoring",
      "Module 6: Streaming & Real-Time - Kinesis Data Streams & Firehose",
      "Module 7: AWS Glue - Crawlers, Catalogs, Serverless ETL, Glue Studio",
      "Module 8: Redshift Data Warehousing - OLAP, Schema Design, Optimization",
      "Module 9: Orchestration - Apache Airflow, DAGs, AWS MWAA",
      "Module 10: Analytics & BI - Athena, QuickSight, BI Integration",
      "Module 11: Monitoring & Logging - CloudWatch, Alarms, Troubleshooting",
      "Capstone: End-to-End Batch Pipeline (S3 → Glue → Redshift)",
      "Capstone: Real-Time Stream Processing with Kinesis & Lambda",
      "Capstone: Data Warehouse Design + BI Dashboard",
    ],
  },
  {
    title: "Database & SQL",
    description: "Master database fundamentals and SQL queries for data management and analysis.",
    price: 999,
    duration: "8 Hours",
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
    price: 999,
    duration: "8 Hours",
    icon: <Code className="w-7 h-7 text-primary" />,
    syllabus: [
      "Module 1: Getting Started - Introduction, Installing Python & PyCharm, Architecture",
      "Module 2: Python Fundamentals - Variables, Data Types, Operators, Conditionals, Loops",
      "Module 3: Functions & Logic - Defining Functions, Lambda, Map, Filter, Reduce",
      "Module 4: Data Structures - Lists, Tuples, Sets, Dictionaries, Slicing",
      "Module 5: File & Error Handling - Text, CSV, JSON, Exception Handling, Logging",
      "Module 6: Object-Oriented Programming - Classes, Inheritance, Encapsulation",
      "Module 7: Data Handling & Mini Project - Pandas, NumPy, MySQL, Report Generation",
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
    price: 999,
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
