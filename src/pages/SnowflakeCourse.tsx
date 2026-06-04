import CourseSyllabusPage, { CourseSyllabusData } from "@/components/CourseSyllabusPage";

const data: CourseSyllabusData = {
  name: "Snowflake",
  tagline: "Cloud Data Warehouse — Complete Syllabus",
  status: "Open for Enrollment",
  duration: "6 Weeks",
  price: 2999,
  originalPrice: 8000,
  overview:
    "Become production-ready on Snowflake — the leading cloud data warehouse — covering architecture, data loading, performance, security and BI integration.",
  outcomes: [
    "Understand Snowflake's multi-cluster architecture",
    "Load and unload data from S3 / Azure / GCS",
    "Use Time Travel and Zero-Copy Cloning",
    "Set up Snowpipe for continuous ingestion",
    "Optimize warehouses, clustering and caching",
    "Implement RBAC and secure data sharing",
  ],
  prerequisites: ["Basic SQL knowledge", "Familiarity with any cloud platform is a plus"],
  projects: [
    "End-to-end data warehouse on Snowflake",
    "Continuous ingestion pipeline using Snowpipe",
    "Power BI / Tableau dashboard on Snowflake data",
  ],
  certification:
    "Receive a Class Codex Snowflake completion certificate and guidance to prepare for the SnowPro Core certification.",
  modules: [
    { title: "Module 1: Introduction to Cloud Data Warehousing", topics: ["OLAP vs OLTP", "Cloud DW landscape", "Why Snowflake"] },
    { title: "Module 2: Snowflake Architecture & Concepts", topics: ["Storage, Compute, Cloud Services", "Virtual Warehouses", "Editions"] },
    { title: "Module 3: Data Loading & Unloading", topics: ["COPY INTO", "Bulk vs continuous loading", "File formats"] },
    { title: "Module 4: Stages & File Formats", topics: ["Internal & External Stages", "CSV/JSON/Parquet", "Semi-structured data"] },
    { title: "Module 5: Time Travel & Data Sharing", topics: ["Time Travel & Fail-safe", "Zero-Copy Cloning", "Secure Data Sharing"] },
    { title: "Module 6: Snowpipe & Continuous Loading", topics: ["Snowpipe setup", "Auto-ingest with S3 events", "Monitoring"] },
    { title: "Module 7: Performance Optimization", topics: ["Warehouse sizing", "Clustering keys", "Result & metadata caching"] },
    { title: "Module 8: Security & Access Control", topics: ["RBAC roles", "Network policies", "Masking & encryption"] },
    { title: "Module 9: Integration with BI Tools", topics: ["Power BI", "Tableau", "dbt basics"] },
  ],
  faqs: [
    { q: "Do I need cloud experience?", a: "No, we cover what you need from scratch." },
    { q: "Will I get hands-on Snowflake access?", a: "Yes, we use the free Snowflake trial throughout the course." },
    { q: "Is this aligned with SnowPro?", a: "The syllabus covers most SnowPro Core topics." },
    { q: "Are recordings provided?", a: "Yes, lifetime access to recordings after enrollment." },
  ],
};

const SnowflakeCourse = () => <CourseSyllabusPage data={data} />;
export default SnowflakeCourse;
