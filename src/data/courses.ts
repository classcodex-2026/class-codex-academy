import { CourseSyllabusData } from "@/components/CourseSyllabusPage";
import { CourseStatus } from "@/components/CourseCard";

export interface CategoryCourse {
  slug: string;
  title: string;
  description: string;
  duration: string;
  modulesCount: number;
  iconName: string;
  status: CourseStatus;
  price?: number | null;
  originalPrice?: number | null;
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  courses: CategoryCourse[];
}

// =========================== MASTER COURSE LIST ===========================
// Single source of truth for every course in the platform.
const COURSES: Record<string, CategoryCourse> = {
  python: {
    slug: "python",
    title: "Python Programming",
    description:
      "End-to-end Python: fundamentals, OOP, file handling, libraries and a capstone project.",
    duration: "12 Weeks",
    modulesCount: 12,
    iconName: "Code",
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 4999,
  },
  sql: {
    slug: "sql",
    title: "SQL",
    description:
      "Master relational databases and SQL — joins, window functions, CTEs and query optimisation.",
    duration: "8 Weeks",
    modulesCount: 9,
    iconName: "Database",
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 3999,
  },
  "data-warehouse-modelling": {
    slug: "data-warehouse-modelling",
    title: "Data Warehouse Modelling",
    description:
      "Dimensional modelling, star/snowflake schemas, SCDs, Data Vault and modern lakehouse patterns.",
    duration: "4 Weeks",
    modulesCount: 8,
    iconName: "Layers",
    status: "Open for Enrollment",
    price: 1999,
    originalPrice: 5999,
  },
  snowflake: {
    slug: "snowflake",
    title: "Snowflake",
    description:
      "Cloud data warehousing with Snowflake — architecture, loading, performance, security and BI integration.",
    duration: "6 Weeks",
    modulesCount: 9,
    iconName: "Snowflake",
    status: "Open for Enrollment",
    price: 2999,
    originalPrice: 8000,
  },
  "aws-data-engineering": {
    slug: "aws-data-engineering",
    title: "AWS Data Engineering",
    description:
      "Build modern data pipelines on AWS using S3, Glue, Lambda, Redshift and EMR.",
    duration: "8 Weeks",
    modulesCount: 10,
    iconName: "Network",
    status: "Coming Soon",
    price: null,
    originalPrice: null,
  },
  excel: {
    slug: "excel",
    title: "Excel",
    description:
      "Excel for analysts — formulas, Power Query, PivotTables, dashboards and automation.",
    duration: "3 Weeks",
    modulesCount: 8,
    iconName: "FileSpreadsheet",
    status: "Open for Enrollment",
    price: 799,
    originalPrice: 2999,
  },
  "power-bi": {
    slug: "power-bi",
    title: "Power BI",
    description:
      "Build interactive dashboards and reports with Power BI — Power Query, DAX and publishing.",
    duration: "4 Weeks",
    modulesCount: 9,
    iconName: "BarChart3",
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 3999,
  },
  "data-analytics-projects": {
    slug: "data-analytics-projects",
    title: "Data Analytics Projects",
    description:
      "Real-world analytics projects: sales, marketing, HR and finance case studies with dashboards.",
    duration: "4 Weeks",
    modulesCount: 6,
    iconName: "FolderKanban",
    status: "Open for Enrollment",
    price: 1299,
    originalPrice: 3999,
  },
  "data-science": {
    slug: "data-science",
    title: "Data Science",
    description:
      "Introduction to Machine Learning, NLP, GenAI and real-world data science projects.",
    duration: "10 Weeks",
    modulesCount: 10,
    iconName: "Brain",
    status: "Open for Enrollment",
    price: 2499,
    originalPrice: 7999,
  },
};

// =========================== CATEGORIES ===========================
const c = (slug: string) => COURSES[slug];

export const categories: Category[] = [
  {
    slug: "python-programming",
    name: "Python Programming",
    tagline: "Master Python from fundamentals to real-world projects",
    description:
      "Learn the world's most versatile programming language with hands-on modules covering core Python, OOP, libraries and real-world projects.",
    courses: [c("python")],
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    tagline: "Build modern, production-grade data platforms",
    description:
      "Master the entire data engineering stack — SQL, Python, warehousing, modelling and cloud platforms.",
    courses: [
      c("sql"),
      c("python"),
      c("snowflake"),
      c("aws-data-engineering"),
      c("data-warehouse-modelling"),
    ],
  },
  {
    slug: "data-analytics",
    name: "Data Analytics",
    tagline: "Turn raw data into business insights",
    description:
      "Career-ready analytics curriculum covering SQL, Excel, Power BI and real analytics projects.",
    courses: [c("sql"), c("excel"), c("power-bi"), c("data-analytics-projects")],
  },
  {
    slug: "data-science",
    name: "Data Science",
    tagline: "Build models that solve real business problems",
    description:
      "Become a data scientist — Machine Learning, NLP, GenAI and applied real-world projects.",
    courses: [c("data-science")],
  },
];

// =========================== SYLLABI ===========================
const mkFaqs = (course: string) => [
  { q: "Who is this course for?", a: `Anyone serious about building a career around ${course}. Beginners and working professionals are both welcome.` },
  { q: "Will I get a certificate?", a: "Yes — a verifiable course completion certificate is issued at the end of the program." },
  { q: "Is there job assistance?", a: "We provide resume reviews, mock interviews and curated job referrals based on availability." },
  { q: "How do I enroll?", a: "Click the Enroll via WhatsApp button and our team will share fees, batch dates and next steps." },
];

const baseCert = (n: string) =>
  `Receive an industry-recognised ClassCodex completion certificate for ${n}, validating the skills and projects you've completed.`;

export const courseSyllabi: Record<string, CourseSyllabusData> = {
  python: {
    name: "Python Programming",
    tagline: "Complete Python Course Syllabus",
    overview:
      "Master Python from scratch — fundamentals, data structures, OOP, libraries and real-world projects to launch your programming career.",
    duration: "12 Weeks",
    modulesCount: 12,
    projectsCount: 4,
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 4999,
    outcomes: [
      "Write clean, efficient Python code",
      "Build real-world applications and scripts",
      "Master OOP and design principles",
      "Work with files, APIs and databases",
      "Use libraries like Pandas and NumPy",
      "Debug, test and ship Python projects",
    ],
    prerequisites: ["No prior programming experience required", "Basic computer literacy"],
    projects: [
      "Console-based utility application",
      "File-processing automation script",
      "OOP-based mini banking system",
      "Data analysis & reporting capstone",
    ],
    certification: baseCert("Python Programming"),
    modules: [
      { title: "Module 1: Python Fundamentals", topics: ["Introduction to Programming & Python", "Installing Python & IDEs", "Python Architecture", "PEP 8 & Best Practices"] },
      { title: "Module 2: Variables and Data Types", topics: ["Variables & Naming", "Numbers, Strings, Booleans", "Type Casting", "Input & Output"] },
      { title: "Module 3: Operators", topics: ["Arithmetic", "Comparison & Logical", "Bitwise & Membership", "Operator Precedence"] },
      { title: "Module 4: Conditional Statements", topics: ["if, elif, else", "Nested Conditionals", "Ternary", "Match-Case"] },
      { title: "Module 5: Loops", topics: ["for & while", "Break, Continue, Pass", "Nested Loops", "Comprehensions"] },
      { title: "Module 6: Functions", topics: ["Definition & Scope", "Arguments & Return", "Lambda & Recursion", "Map/Filter/Reduce"] },
      { title: "Module 7: Collections", topics: ["Lists", "Tuples & Sets", "Dictionaries", "Slicing & Iteration"] },
      { title: "Module 8: File Handling", topics: ["Reading & Writing Files", "CSV & JSON", "Paths", "Context Managers"] },
      { title: "Module 9: Exception Handling", topics: ["try/except/finally", "Raising", "Custom Exceptions", "Logging"] },
      { title: "Module 10: OOP", topics: ["Classes & Objects", "Inheritance", "Encapsulation", "Static & Class Methods"] },
      { title: "Module 11: Libraries", topics: ["Standard Library", "pip & venv", "NumPy & Pandas", "Requests & APIs"] },
      { title: "Module 12: Real-world Projects", topics: ["Project structure", "CLI app", "Data analysis", "Deployment"] },
    ],
    faqs: mkFaqs("Python Programming"),
  },

  sql: {
    name: "SQL",
    tagline: "Complete SQL Syllabus",
    overview:
      "Master relational databases and SQL from fundamentals to advanced query optimisation and analytics.",
    duration: "8 Weeks",
    modulesCount: 9,
    projectsCount: 2,
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 3999,
    outcomes: [
      "Write efficient SQL queries",
      "Design normalised schemas",
      "Use joins, subqueries and CTEs",
      "Optimise with indexes and plans",
      "Build stored procedures",
      "Apply SQL in real analytics scenarios",
    ],
    prerequisites: ["No prior database experience required"],
    projects: ["E-commerce sales analysis", "Employee management database"],
    certification: baseCert("SQL"),
    modules: [
      { title: "Module 1: Databases & RDBMS", topics: ["DBMS vs RDBMS", "Popular systems", "Installing MySQL/PostgreSQL"] },
      { title: "Module 2: SQL Fundamentals", topics: ["SELECT, WHERE", "ORDER BY, LIMIT", "DISTINCT", "Aliases"] },
      { title: "Module 3: Joins", topics: ["INNER", "LEFT/RIGHT", "FULL OUTER", "SELF & CROSS"] },
      { title: "Module 4: Aggregations", topics: ["COUNT, SUM, AVG", "GROUP BY & HAVING", "Window functions intro"] },
      { title: "Module 5: Subqueries & CTEs", topics: ["Scalar", "Correlated", "CTEs", "Recursive CTEs"] },
      { title: "Module 6: Database Design", topics: ["ER modelling", "Normalisation", "Keys", "Constraints"] },
      { title: "Module 7: Indexing & Optimisation", topics: ["B-Tree & Hash", "EXPLAIN plans", "Tuning"] },
      { title: "Module 8: Procedures & Triggers", topics: ["Stored procedures", "Functions", "Triggers", "Transactions"] },
      { title: "Module 9: Projects", topics: ["Analytics queries", "Reporting", "Capstone"] },
    ],
    faqs: mkFaqs("SQL"),
  },

  "data-warehouse-modelling": {
    name: "Data Warehouse Modelling",
    tagline: "Dimensional, Vault and Lakehouse Patterns",
    overview:
      "Design scalable analytical models — Kimball, Inmon, Data Vault and modern lakehouse approaches.",
    duration: "4 Weeks",
    modulesCount: 8,
    projectsCount: 1,
    status: "Open for Enrollment",
    price: 1999,
    originalPrice: 5999,
    outcomes: ["Design star/snowflake schemas", "Handle SCDs", "Apply Data Vault 2.0", "Model lakehouse zones"],
    prerequisites: ["SQL basics"],
    projects: ["End-to-end dimensional model"],
    certification: baseCert("Data Warehouse Modelling"),
    modules: [
      { title: "Module 1: Modelling Foundations", topics: ["OLTP vs OLAP", "Grain & facts", "Dimensions", "Bus matrix"] },
      { title: "Module 2: Kimball Dimensional", topics: ["Star schema", "Snowflake schema", "Conformed dimensions"] },
      { title: "Module 3: Slowly Changing Dimensions", topics: ["Type 1/2/3", "Effective dates", "Surrogate keys"] },
      { title: "Module 4: Inmon Approach", topics: ["3NF EDW", "Data marts", "Comparing approaches"] },
      { title: "Module 5: Data Vault 2.0", topics: ["Hubs, links, satellites", "Loading patterns"] },
      { title: "Module 6: Lakehouse Modelling", topics: ["Bronze/Silver/Gold", "Delta/Iceberg"] },
      { title: "Module 7: Documentation", topics: ["Catalogs", "Lineage", "Naming"] },
      { title: "Module 8: Capstone Model", topics: ["Analysis", "Design", "Implementation"] },
    ],
    faqs: mkFaqs("Data Warehouse Modelling"),
  },

  snowflake: {
    name: "Snowflake",
    tagline: "Cloud Data Warehousing with Snowflake",
    overview:
      "Master Snowflake architecture, data loading, performance tuning, security and BI integration.",
    duration: "6 Weeks",
    modulesCount: 9,
    projectsCount: 2,
    status: "Open for Enrollment",
    price: 2999,
    originalPrice: 8000,
    outcomes: ["Design Snowflake warehouses", "Load and transform data", "Optimise queries & costs", "Implement RBAC"],
    prerequisites: ["Basic SQL"],
    projects: ["End-to-end warehouse build", "BI integration capstone"],
    certification: baseCert("Snowflake"),
    modules: [
      { title: "Module 1: Snowflake Architecture", topics: ["Cloud-native design", "Storage/compute layers", "Virtual warehouses"] },
      { title: "Module 2: Databases & Schemas", topics: ["Creating databases", "Tables & views", "Time travel"] },
      { title: "Module 3: Data Loading", topics: ["Stages", "COPY INTO", "Snowpipe"] },
      { title: "Module 4: SQL in Snowflake", topics: ["DDL & DML", "Window functions", "Semi-structured data"] },
      { title: "Module 5: Performance & Tuning", topics: ["Clustering keys", "Query profile", "Cost optimisation"] },
      { title: "Module 6: Security & RBAC", topics: ["Roles", "Masking policies", "Network policies"] },
      { title: "Module 7: Data Sharing", topics: ["Secure sharing", "Marketplace", "Replication"] },
      { title: "Module 8: BI Integration", topics: ["Power BI/Tableau", "Semantic models"] },
      { title: "Module 9: Project", topics: ["Design", "Build", "Optimise", "Deliver"] },
    ],
    faqs: mkFaqs("Snowflake"),
  },

  "aws-data-engineering": {
    name: "AWS Data Engineering",
    tagline: "Modern Data Pipelines on AWS",
    overview:
      "Build production data pipelines on AWS using S3, Glue, Lambda, Redshift, EMR and Athena.",
    duration: "8 Weeks",
    modulesCount: 10,
    projectsCount: 2,
    status: "Coming Soon",
    price: null,
    originalPrice: null,
    outcomes: ["Design AWS data architectures", "Build ETL with Glue", "Use S3 data lakes", "Query with Athena & Redshift"],
    prerequisites: ["SQL basics", "Python basics helpful"],
    projects: ["Batch pipeline on AWS", "Streaming pipeline with Kinesis"],
    certification: baseCert("AWS Data Engineering"),
    modules: [
      { title: "Module 1: AWS Foundations", topics: ["IAM", "Regions & AZs", "VPC basics"] },
      { title: "Module 2: S3 Data Lake", topics: ["Buckets", "Partitioning", "Lifecycle"] },
      { title: "Module 3: AWS Glue", topics: ["Crawlers", "Jobs", "Data Catalog"] },
      { title: "Module 4: Athena", topics: ["Querying S3", "Performance", "Federated queries"] },
      { title: "Module 5: Redshift", topics: ["Architecture", "Distribution keys", "Workload management"] },
      { title: "Module 6: EMR & Spark", topics: ["Cluster setup", "PySpark on EMR", "Tuning"] },
      { title: "Module 7: Lambda & Step Functions", topics: ["Event-driven ETL", "Orchestration"] },
      { title: "Module 8: Streaming", topics: ["Kinesis", "MSK", "Firehose"] },
      { title: "Module 9: Monitoring & Security", topics: ["CloudWatch", "KMS", "Lake Formation"] },
      { title: "Module 10: Capstone", topics: ["End-to-end pipeline on AWS"] },
    ],
    faqs: mkFaqs("AWS Data Engineering"),
  },

  excel: {
    name: "Excel",
    tagline: "Modern Excel for Analysts",
    overview:
      "Master Excel as an analytics powerhouse — formulas, Power Query, PivotTables, dashboards and automation.",
    duration: "3 Weeks",
    modulesCount: 8,
    projectsCount: 2,
    status: "Open for Enrollment",
    price: 799,
    originalPrice: 2999,
    outcomes: ["Build clean datasets", "Automate with Power Query", "Master pivot analytics", "Design dashboards"],
    prerequisites: ["Basic Excel familiarity"],
    projects: ["Sales performance dashboard", "Operational KPI report"],
    certification: baseCert("Excel"),
    modules: [
      { title: "Module 1: Excel Foundations", topics: ["Workbook structure", "Formatting", "Tables"] },
      { title: "Module 2: Essential Formulas", topics: ["IF, IFS", "Lookups", "Text & date"] },
      { title: "Module 3: Advanced Formulas", topics: ["XLOOKUP", "INDEX/MATCH", "FILTER, SORT, UNIQUE"] },
      { title: "Module 4: Power Query", topics: ["Importing data", "Transforms", "Merging"] },
      { title: "Module 5: PivotTables", topics: ["Building pivots", "Calculated fields", "Slicers"] },
      { title: "Module 6: Power Pivot & DAX", topics: ["Data model", "Relationships", "Measures"] },
      { title: "Module 7: Dashboards", topics: ["Layout", "Charts", "Interactivity"] },
      { title: "Module 8: Project", topics: ["Scope", "Build", "Polish", "Deliver"] },
    ],
    faqs: mkFaqs("Excel"),
  },

  "power-bi": {
    name: "Power BI",
    tagline: "Business Intelligence — Complete Syllabus",
    overview:
      "Build interactive dashboards and enterprise BI solutions with Microsoft Power BI.",
    duration: "4 Weeks",
    modulesCount: 9,
    projectsCount: 2,
    status: "Open for Enrollment",
    price: 999,
    originalPrice: 3999,
    outcomes: ["Connect & transform data", "Master DAX", "Build dashboards", "Publish on Power BI Service", "Implement RLS"],
    prerequisites: ["Basic Excel knowledge"],
    projects: ["Sales performance dashboard", "Executive KPI dashboard"],
    certification: baseCert("Power BI"),
    modules: [
      { title: "Module 1: Introduction to BI", topics: ["BI landscape", "Power BI ecosystem"] },
      { title: "Module 2: Power BI Desktop", topics: ["UI walkthrough", "Report, Data, Model views"] },
      { title: "Module 3: Connecting Data", topics: ["Files, Databases, APIs", "Direct Query vs Import"] },
      { title: "Module 4: Power Query", topics: ["M language basics", "Merging queries", "Cleaning"] },
      { title: "Module 5: DAX Fundamentals", topics: ["Calculated columns vs measures", "Filter context", "Time intelligence"] },
      { title: "Module 6: Visualisations", topics: ["Core visuals", "Custom visuals", "Formatting"] },
      { title: "Module 7: Interactive Dashboards", topics: ["Slicers", "Bookmarks", "Drill-through"] },
      { title: "Module 8: Publishing", topics: ["Power BI Service", "Workspaces", "Refresh"] },
      { title: "Module 9: Service & Security", topics: ["Row-Level Security", "Gateways", "Governance"] },
    ],
    faqs: mkFaqs("Power BI"),
  },

  "data-analytics-projects": {
    name: "Data Analytics Projects",
    tagline: "Real-world Analytics Case Studies",
    overview:
      "Build a strong analytics portfolio with practical projects across sales, marketing, HR and finance.",
    duration: "4 Weeks",
    modulesCount: 6,
    projectsCount: 5,
    status: "Open for Enrollment",
    price: 1299,
    originalPrice: 3999,
    outcomes: ["Frame business problems", "Clean & analyse data", "Build dashboards", "Communicate insights"],
    prerequisites: ["SQL or Excel basics"],
    projects: ["Sales analytics", "Marketing funnel", "HR attrition", "Finance reporting", "Capstone"],
    certification: baseCert("Data Analytics Projects"),
    modules: [
      { title: "Project 1: Sales Analytics", topics: ["Data prep", "KPIs", "Dashboard", "Story"] },
      { title: "Project 2: Marketing Funnel", topics: ["Acquisition", "Conversion", "Retention"] },
      { title: "Project 3: HR Attrition", topics: ["EDA", "Drivers", "Visuals"] },
      { title: "Project 4: Finance Reporting", topics: ["P&L", "Variance", "Forecast"] },
      { title: "Project 5: Capstone", topics: ["Scope", "Build", "Present"] },
      { title: "Portfolio & Career", topics: ["GitHub", "Resume", "Interviews"] },
    ],
    faqs: mkFaqs("Data Analytics Projects"),
  },

  "data-science": {
    name: "Data Science",
    tagline: "ML, NLP, GenAI & Real-world Projects",
    overview:
      "Become a data scientist — covering Introduction to Machine Learning, Natural Language Processing, Generative AI and end-to-end real-world projects.",
    duration: "10 Weeks",
    modulesCount: 10,
    projectsCount: 4,
    status: "Open for Enrollment",
    price: 2499,
    originalPrice: 7999,
    outcomes: [
      "Understand ML fundamentals",
      "Build supervised & unsupervised models",
      "Apply NLP techniques",
      "Work with GenAI and LLMs",
      "Deliver real-world projects",
      "Build a strong portfolio",
    ],
    prerequisites: ["Python basics helpful", "Curiosity and consistency"],
    projects: [
      "Classification project",
      "NLP sentiment analysis",
      "GenAI assistant with LLMs",
      "End-to-end capstone",
    ],
    certification: baseCert("Data Science"),
    modules: [
      { title: "Module 1: Introduction to Machine Learning", topics: ["ML workflow", "Supervised vs unsupervised", "Tooling", "Pitfalls"] },
      { title: "Module 2: Data Preparation & EDA", topics: ["Cleaning", "Feature engineering", "Visualisation"] },
      { title: "Module 3: Supervised Learning", topics: ["Linear & logistic regression", "Decision trees", "Random Forest", "XGBoost"] },
      { title: "Module 4: Model Evaluation", topics: ["Cross-validation", "Metrics", "ROC/PR", "Tuning"] },
      { title: "Module 5: Unsupervised Learning", topics: ["K-Means", "Hierarchical", "PCA"] },
      { title: "Module 6: NLP Fundamentals", topics: ["Text preprocessing", "Vectorisation (TF-IDF)", "Embeddings", "Sentiment analysis"] },
      { title: "Module 7: NLP with Transformers", topics: ["Attention basics", "HuggingFace", "Fine-tuning"] },
      { title: "Module 8: Generative AI", topics: ["LLM fundamentals", "Prompt engineering", "RAG", "Vector databases"] },
      { title: "Module 9: GenAI Applications", topics: ["Building chatbots", "LangChain basics", "Evaluating outputs"] },
      { title: "Module 10: Real-world Projects", topics: ["Project scoping", "Modelling", "Deployment", "Demo"] },
    ],
    faqs: mkFaqs("Data Science"),
  },
};

// Deduplicated list of every course (a course shared across categories appears once).
export const getAllCourses = () =>
  Object.values(COURSES).map((course) => {
    const category = categories.find((cat) => cat.courses.some((cc) => cc.slug === course.slug));
    return {
      ...course,
      categorySlug: category?.slug ?? "",
      categoryName: category?.name ?? "",
    };
  });
