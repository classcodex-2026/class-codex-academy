import CourseSyllabusPage, { CourseSyllabusData } from "@/components/CourseSyllabusPage";

const data: CourseSyllabusData = {
  name: "Database & SQL",
  tagline: "Complete Course Syllabus",
  status: "Open for Enrollment",
  duration: "8 Hours",
  price: 999,
  originalPrice: 3999,
  overview:
    "Master relational database concepts and SQL — from fundamentals to advanced query optimization — to confidently work with real-world data systems.",
  outcomes: [
    "Write efficient SQL queries for analysis and reporting",
    "Design normalized relational database schemas",
    "Use joins, subqueries and CTEs with confidence",
    "Optimize queries with indexes and execution plans",
    "Build stored procedures, functions and triggers",
    "Apply SQL in real-world analytics scenarios",
  ],
  prerequisites: [
    "No prior database experience required",
    "Basic computer literacy",
    "Willingness to practice hands-on exercises",
  ],
  projects: [
    "E-commerce sales analysis using SQL",
    "Employee management database design",
    "Reporting queries on a real-world dataset",
  ],
  certification:
    "Receive a Class Codex Database & SQL completion certificate after finishing all modules and the capstone exercises.",
  modules: [
    {
      title: "Module 1: Introduction to Databases & RDBMS",
      topics: [
        "What is a database",
        "DBMS vs RDBMS",
        "Popular RDBMS systems",
        "Installing MySQL / PostgreSQL",
      ],
    },
    {
      title: "Module 2: SQL Fundamentals",
      topics: [
        "SELECT, WHERE, ORDER BY",
        "Filtering and operators",
        "DISTINCT, LIMIT, OFFSET",
        "Aliases and basic expressions",
      ],
    },
    {
      title: "Module 3: Joins",
      topics: ["INNER JOIN", "LEFT / RIGHT JOIN", "FULL OUTER JOIN", "SELF JOIN & CROSS JOIN"],
    },
    {
      title: "Module 4: Aggregate Functions & GROUP BY",
      topics: ["COUNT, SUM, AVG, MIN, MAX", "GROUP BY & HAVING", "Window functions intro"],
    },
    {
      title: "Module 5: Subqueries & CTEs",
      topics: ["Scalar & correlated subqueries", "EXISTS / IN", "Common Table Expressions", "Recursive CTEs"],
    },
    {
      title: "Module 6: Database Design & Normalization",
      topics: ["ER modeling", "1NF, 2NF, 3NF", "Primary & foreign keys", "Constraints"],
    },
    {
      title: "Module 7: Indexing & Query Optimization",
      topics: ["B-Tree & Hash indexes", "EXPLAIN plans", "Performance tuning tips"],
    },
    {
      title: "Module 8: Stored Procedures & Functions",
      topics: ["Procedures vs Functions", "Triggers", "Transactions & ACID"],
    },
    {
      title: "Module 9: Real-world Projects & Case Studies",
      topics: ["Analytics queries", "Reporting", "Capstone exercise"],
    },
  ],
  faqs: [
    { q: "Do I need any prior coding experience?", a: "No. The course starts from absolute basics." },
    { q: "Which database will we use?", a: "We primarily use MySQL / PostgreSQL; concepts apply to all SQL databases." },
    { q: "Will I get a certificate?", a: "Yes, you get a completion certificate after the capstone." },
    { q: "Is there placement support?", a: "Yes, we provide interview prep and placement guidance." },
  ],
};

const SQLCourse = () => <CourseSyllabusPage data={data} />;
export default SQLCourse;
