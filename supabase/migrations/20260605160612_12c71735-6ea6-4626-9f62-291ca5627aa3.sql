
-- =========================== ENUMS ===========================
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.course_category AS ENUM ('python_programming','data_engineering','data_analytics','data_science');
CREATE TYPE public.course_status AS ENUM ('open','coming_soon','closed');
CREATE TYPE public.video_source AS ENUM ('youtube','vimeo','upload');
CREATE TYPE public.webinar_status AS ENUM ('upcoming','completed');

-- =========================== updated_at trigger fn ===========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================== USER ROLES ===========================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- First user becomes admin automatically (bootstrap)
CREATE OR REPLACE FUNCTION public.handle_first_user_as_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_as_admin();

-- =========================== COURSES ===========================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category public.course_category NOT NULL,
  status public.course_status NOT NULL DEFAULT 'open',
  tagline TEXT,
  description TEXT,
  overview TEXT,
  instructor_name TEXT,
  duration TEXT,
  timing TEXT,
  fee NUMERIC,
  original_fee NUMERIC,
  banner_url TEXT,
  icon_name TEXT,
  outcomes JSONB DEFAULT '[]'::jsonb,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certification TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins write courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================== COURSE MODULES ===========================
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topics JSONB DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_modules TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Admins write modules" ON public.course_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_modules_course ON public.course_modules(course_id, sort_order);

-- =========================== COURSE VIDEOS ===========================
CREATE TABLE public.course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  source_type public.video_source NOT NULL DEFAULT 'youtube',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_videos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_videos TO authenticated;
GRANT ALL ON public.course_videos TO service_role;
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read videos" ON public.course_videos FOR SELECT USING (true);
CREATE POLICY "Admins write videos" ON public.course_videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.course_videos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_videos_module ON public.course_videos(module_id, sort_order);

-- =========================== WEBINARS ===========================
CREATE TABLE public.webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  banner_url TEXT,
  scheduled_date DATE,
  scheduled_time TEXT,
  status public.webinar_status NOT NULL DEFAULT 'upcoming',
  recording_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.webinars TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webinars TO authenticated;
GRANT ALL ON public.webinars TO service_role;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read webinars" ON public.webinars FOR SELECT USING (true);
CREATE POLICY "Admins write webinars" ON public.webinars FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_webinars_updated BEFORE UPDATE ON public.webinars FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================== CONSULTATION REQUESTS ===========================
CREATE TABLE public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  interested_course TEXT,
  requirement TEXT,
  contacted BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consultation_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submits requests" ON public.consultation_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read requests" ON public.consultation_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update requests" ON public.consultation_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete requests" ON public.consultation_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON public.consultation_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================== SITE SETTINGS ===========================
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  website_name TEXT DEFAULT 'ClassCodex',
  tagline TEXT DEFAULT 'Mastering In-Demand Tech Skills',
  logo_url TEXT,
  whatsapp_number TEXT DEFAULT '919629997602',
  contact_email TEXT DEFAULT 'classcodexx@gmail.com',
  about_us TEXT,
  footer_content TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id) VALUES (1);

-- =========================== SEED COURSES ===========================
INSERT INTO public.courses (slug,title,category,status,tagline,description,overview,duration,fee,original_fee,icon_name,sort_order,outcomes,prerequisites,projects,certification) VALUES
('python','Python Programming','python_programming','open','Complete Python Course Syllabus','End-to-end Python: fundamentals, OOP, file handling, libraries and a capstone project.','Master Python from scratch — fundamentals, data structures, OOP, libraries and real-world projects to launch your programming career.','12 Weeks',999,4999,'Code',1,'["Write clean, efficient Python code","Build real-world applications and scripts","Master OOP and design principles","Work with files, APIs and databases","Use libraries like Pandas and NumPy","Debug, test and ship Python projects"]'::jsonb,'["No prior programming experience required","Basic computer literacy"]'::jsonb,'["Console-based utility application","File-processing automation script","OOP-based mini banking system","Data analysis & reporting capstone"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Python Programming.'),
('sql','SQL','data_engineering','open','Complete SQL Syllabus','Master relational databases and SQL — joins, window functions, CTEs and query optimisation.','Master relational databases and SQL from fundamentals to advanced query optimisation and analytics.','8 Weeks',999,3999,'Database',2,'["Write efficient SQL queries","Design normalised schemas","Use joins, subqueries and CTEs","Optimise with indexes and plans","Build stored procedures","Apply SQL in real analytics scenarios"]'::jsonb,'["No prior database experience required"]'::jsonb,'["E-commerce sales analysis","Employee management database"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for SQL.'),
('data-warehouse-modelling','Data Warehouse Modelling','data_engineering','open','Dimensional, Vault and Lakehouse Patterns','Dimensional modelling, star/snowflake schemas, SCDs, Data Vault and modern lakehouse patterns.','Design scalable analytical models — Kimball, Inmon, Data Vault and modern lakehouse approaches.','4 Weeks',1999,5999,'Layers',3,'["Design star/snowflake schemas","Handle SCDs","Apply Data Vault 2.0","Model lakehouse zones"]'::jsonb,'["SQL basics"]'::jsonb,'["End-to-end dimensional model"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Data Warehouse Modelling.'),
('snowflake','Snowflake','data_engineering','open','Cloud Data Warehousing with Snowflake','Cloud data warehousing with Snowflake — architecture, loading, performance, security and BI integration.','Master Snowflake architecture, data loading, performance tuning, security and BI integration.','6 Weeks',2999,8000,'Snowflake',4,'["Design Snowflake warehouses","Load and transform data","Optimise queries & costs","Implement RBAC"]'::jsonb,'["Basic SQL"]'::jsonb,'["End-to-end warehouse build","BI integration capstone"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Snowflake.'),
('aws-data-engineering','AWS Data Engineering','data_engineering','coming_soon','Modern Data Pipelines on AWS','Build modern data pipelines on AWS using S3, Glue, Lambda, Redshift and EMR.','Build production data pipelines on AWS using S3, Glue, Lambda, Redshift, EMR and Athena.','8 Weeks',NULL,NULL,'Network',5,'["Design AWS data architectures","Build ETL with Glue","Use S3 data lakes","Query with Athena & Redshift"]'::jsonb,'["SQL basics","Python basics helpful"]'::jsonb,'["Batch pipeline on AWS","Streaming pipeline with Kinesis"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for AWS Data Engineering.'),
('excel','Excel','data_analytics','open','Modern Excel for Analysts','Excel for analysts — formulas, Power Query, PivotTables, dashboards and automation.','Master Excel as an analytics powerhouse — formulas, Power Query, PivotTables, dashboards and automation.','3 Weeks',799,2999,'FileSpreadsheet',6,'["Build clean datasets","Automate with Power Query","Master pivot analytics","Design dashboards"]'::jsonb,'["Basic Excel familiarity"]'::jsonb,'["Sales performance dashboard","Operational KPI report"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Excel.'),
('power-bi','Power BI','data_analytics','open','Business Intelligence — Complete Syllabus','Build interactive dashboards and reports with Power BI — Power Query, DAX and publishing.','Build interactive dashboards and enterprise BI solutions with Microsoft Power BI.','4 Weeks',999,3999,'BarChart3',7,'["Connect & transform data","Master DAX","Build dashboards","Publish on Power BI Service","Implement RLS"]'::jsonb,'["Basic Excel knowledge"]'::jsonb,'["Sales performance dashboard","Executive KPI dashboard"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Power BI.'),
('data-analytics-projects','Data Analytics Projects','data_analytics','open','Real-world Analytics Case Studies','Real-world analytics projects: sales, marketing, HR and finance case studies with dashboards.','Build a strong analytics portfolio with practical projects across sales, marketing, HR and finance.','4 Weeks',1299,3999,'FolderKanban',8,'["Frame business problems","Clean & analyse data","Build dashboards","Communicate insights"]'::jsonb,'["SQL or Excel basics"]'::jsonb,'["Sales analytics","Marketing funnel","HR attrition","Finance reporting","Capstone"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Data Analytics Projects.'),
('data-science','Data Science','data_science','open','ML, NLP, GenAI & Real-world Projects','Introduction to Machine Learning, NLP, GenAI and real-world data science projects.','Become a data scientist — covering Introduction to Machine Learning, Natural Language Processing, Generative AI and end-to-end real-world projects.','10 Weeks',2499,7999,'Brain',9,'["Understand ML fundamentals","Build supervised & unsupervised models","Apply NLP techniques","Work with GenAI and LLMs","Deliver real-world projects","Build a strong portfolio"]'::jsonb,'["Python basics helpful","Curiosity and consistency"]'::jsonb,'["Classification project","NLP sentiment analysis","GenAI assistant with LLMs","End-to-end capstone"]'::jsonb,'Receive an industry-recognised ClassCodex completion certificate for Data Science.');

-- Seed modules
INSERT INTO public.course_modules (course_id, title, topics, sort_order)
SELECT c.id, m.title, m.topics::jsonb, m.ord
FROM public.courses c
JOIN (VALUES
  ('python',1,'Module 1: Python Fundamentals','["Introduction to Programming & Python","Installing Python & IDEs","Python Architecture","PEP 8 & Best Practices"]'),
  ('python',2,'Module 2: Variables and Data Types','["Variables & Naming","Numbers, Strings, Booleans","Type Casting","Input & Output"]'),
  ('python',3,'Module 3: Operators','["Arithmetic","Comparison & Logical","Bitwise & Membership","Operator Precedence"]'),
  ('python',4,'Module 4: Conditional Statements','["if, elif, else","Nested Conditionals","Ternary","Match-Case"]'),
  ('python',5,'Module 5: Loops','["for & while","Break, Continue, Pass","Nested Loops","Comprehensions"]'),
  ('python',6,'Module 6: Functions','["Definition & Scope","Arguments & Return","Lambda & Recursion","Map/Filter/Reduce"]'),
  ('python',7,'Module 7: Collections','["Lists","Tuples & Sets","Dictionaries","Slicing & Iteration"]'),
  ('python',8,'Module 8: File Handling','["Reading & Writing Files","CSV & JSON","Paths","Context Managers"]'),
  ('python',9,'Module 9: Exception Handling','["try/except/finally","Raising","Custom Exceptions","Logging"]'),
  ('python',10,'Module 10: OOP','["Classes & Objects","Inheritance","Encapsulation","Static & Class Methods"]'),
  ('python',11,'Module 11: Libraries','["Standard Library","pip & venv","NumPy & Pandas","Requests & APIs"]'),
  ('python',12,'Module 12: Real-world Projects','["Project structure","CLI app","Data analysis","Deployment"]'),
  ('sql',1,'Module 1: Databases & RDBMS','["DBMS vs RDBMS","Popular systems","Installing MySQL/PostgreSQL"]'),
  ('sql',2,'Module 2: SQL Fundamentals','["SELECT, WHERE","ORDER BY, LIMIT","DISTINCT","Aliases"]'),
  ('sql',3,'Module 3: Joins','["INNER","LEFT/RIGHT","FULL OUTER","SELF & CROSS"]'),
  ('sql',4,'Module 4: Aggregations','["COUNT, SUM, AVG","GROUP BY & HAVING","Window functions intro"]'),
  ('sql',5,'Module 5: Subqueries & CTEs','["Scalar","Correlated","CTEs","Recursive CTEs"]'),
  ('sql',6,'Module 6: Database Design','["ER modelling","Normalisation","Keys","Constraints"]'),
  ('sql',7,'Module 7: Indexing & Optimisation','["B-Tree & Hash","EXPLAIN plans","Tuning"]'),
  ('sql',8,'Module 8: Procedures & Triggers','["Stored procedures","Functions","Triggers","Transactions"]'),
  ('sql',9,'Module 9: Projects','["Analytics queries","Reporting","Capstone"]'),
  ('data-warehouse-modelling',1,'Module 1: Modelling Foundations','["OLTP vs OLAP","Grain & facts","Dimensions","Bus matrix"]'),
  ('data-warehouse-modelling',2,'Module 2: Kimball Dimensional','["Star schema","Snowflake schema","Conformed dimensions"]'),
  ('data-warehouse-modelling',3,'Module 3: Slowly Changing Dimensions','["Type 1/2/3","Effective dates","Surrogate keys"]'),
  ('data-warehouse-modelling',4,'Module 4: Inmon Approach','["3NF EDW","Data marts","Comparing approaches"]'),
  ('data-warehouse-modelling',5,'Module 5: Data Vault 2.0','["Hubs, links, satellites","Loading patterns"]'),
  ('data-warehouse-modelling',6,'Module 6: Lakehouse Modelling','["Bronze/Silver/Gold","Delta/Iceberg"]'),
  ('data-warehouse-modelling',7,'Module 7: Documentation','["Catalogs","Lineage","Naming"]'),
  ('data-warehouse-modelling',8,'Module 8: Capstone Model','["Analysis","Design","Implementation"]'),
  ('snowflake',1,'Module 1: Snowflake Architecture','["Cloud-native design","Storage/compute layers","Virtual warehouses"]'),
  ('snowflake',2,'Module 2: Databases & Schemas','["Creating databases","Tables & views","Time travel"]'),
  ('snowflake',3,'Module 3: Data Loading','["Stages","COPY INTO","Snowpipe"]'),
  ('snowflake',4,'Module 4: SQL in Snowflake','["DDL & DML","Window functions","Semi-structured data"]'),
  ('snowflake',5,'Module 5: Performance & Tuning','["Clustering keys","Query profile","Cost optimisation"]'),
  ('snowflake',6,'Module 6: Security & RBAC','["Roles","Masking policies","Network policies"]'),
  ('snowflake',7,'Module 7: Data Sharing','["Secure sharing","Marketplace","Replication"]'),
  ('snowflake',8,'Module 8: BI Integration','["Power BI/Tableau","Semantic models"]'),
  ('snowflake',9,'Module 9: Project','["Design","Build","Optimise","Deliver"]'),
  ('aws-data-engineering',1,'Module 1: AWS Foundations','["IAM","Regions & AZs","VPC basics"]'),
  ('aws-data-engineering',2,'Module 2: S3 Data Lake','["Buckets","Partitioning","Lifecycle"]'),
  ('aws-data-engineering',3,'Module 3: AWS Glue','["Crawlers","Jobs","Data Catalog"]'),
  ('aws-data-engineering',4,'Module 4: Athena','["Querying S3","Performance","Federated queries"]'),
  ('aws-data-engineering',5,'Module 5: Redshift','["Architecture","Distribution keys","Workload management"]'),
  ('aws-data-engineering',6,'Module 6: EMR & Spark','["Cluster setup","PySpark on EMR","Tuning"]'),
  ('aws-data-engineering',7,'Module 7: Lambda & Step Functions','["Event-driven ETL","Orchestration"]'),
  ('aws-data-engineering',8,'Module 8: Streaming','["Kinesis","MSK","Firehose"]'),
  ('aws-data-engineering',9,'Module 9: Monitoring & Security','["CloudWatch","KMS","Lake Formation"]'),
  ('aws-data-engineering',10,'Module 10: Capstone','["End-to-end pipeline on AWS"]'),
  ('excel',1,'Module 1: Excel Foundations','["Workbook structure","Formatting","Tables"]'),
  ('excel',2,'Module 2: Essential Formulas','["IF, IFS","Lookups","Text & date"]'),
  ('excel',3,'Module 3: Advanced Formulas','["XLOOKUP","INDEX/MATCH","FILTER, SORT, UNIQUE"]'),
  ('excel',4,'Module 4: Power Query','["Importing data","Transforms","Merging"]'),
  ('excel',5,'Module 5: PivotTables','["Building pivots","Calculated fields","Slicers"]'),
  ('excel',6,'Module 6: Power Pivot & DAX','["Data model","Relationships","Measures"]'),
  ('excel',7,'Module 7: Dashboards','["Layout","Charts","Interactivity"]'),
  ('excel',8,'Module 8: Project','["Scope","Build","Polish","Deliver"]'),
  ('power-bi',1,'Module 1: Introduction to BI','["BI landscape","Power BI ecosystem"]'),
  ('power-bi',2,'Module 2: Power BI Desktop','["UI walkthrough","Report, Data, Model views"]'),
  ('power-bi',3,'Module 3: Connecting Data','["Files, Databases, APIs","Direct Query vs Import"]'),
  ('power-bi',4,'Module 4: Power Query','["M language basics","Merging queries","Cleaning"]'),
  ('power-bi',5,'Module 5: DAX Fundamentals','["Calculated columns vs measures","Filter context","Time intelligence"]'),
  ('power-bi',6,'Module 6: Visualisations','["Core visuals","Custom visuals","Formatting"]'),
  ('power-bi',7,'Module 7: Interactive Dashboards','["Slicers","Bookmarks","Drill-through"]'),
  ('power-bi',8,'Module 8: Publishing','["Power BI Service","Workspaces","Refresh"]'),
  ('power-bi',9,'Module 9: Service & Security','["Row-Level Security","Gateways","Governance"]'),
  ('data-analytics-projects',1,'Project 1: Sales Analytics','["Data prep","KPIs","Dashboard","Story"]'),
  ('data-analytics-projects',2,'Project 2: Marketing Funnel','["Acquisition","Conversion","Retention"]'),
  ('data-analytics-projects',3,'Project 3: HR Attrition','["EDA","Drivers","Visuals"]'),
  ('data-analytics-projects',4,'Project 4: Finance Reporting','["P&L","Variance","Forecast"]'),
  ('data-analytics-projects',5,'Project 5: Capstone','["Scope","Build","Present"]'),
  ('data-analytics-projects',6,'Portfolio & Career','["GitHub","Resume","Interviews"]'),
  ('data-science',1,'Module 1: Introduction to Machine Learning','["ML workflow","Supervised vs unsupervised","Tooling","Pitfalls"]'),
  ('data-science',2,'Module 2: Data Preparation & EDA','["Cleaning","Feature engineering","Visualisation"]'),
  ('data-science',3,'Module 3: Supervised Learning','["Linear & logistic regression","Decision trees","Random Forest","XGBoost"]'),
  ('data-science',4,'Module 4: Model Evaluation','["Cross-validation","Metrics","ROC/PR","Tuning"]'),
  ('data-science',5,'Module 5: Unsupervised Learning','["K-Means","Hierarchical","PCA"]'),
  ('data-science',6,'Module 6: NLP Fundamentals','["Text preprocessing","Vectorisation (TF-IDF)","Embeddings","Sentiment analysis"]'),
  ('data-science',7,'Module 7: NLP with Transformers','["Attention basics","HuggingFace","Fine-tuning"]'),
  ('data-science',8,'Module 8: Generative AI','["LLM fundamentals","Prompt engineering","RAG","Vector databases"]'),
  ('data-science',9,'Module 9: GenAI Applications','["Building chatbots","LangChain basics","Evaluating outputs"]'),
  ('data-science',10,'Module 10: Real-world Projects','["Project scoping","Modelling","Deployment","Demo"]')
) AS m(course_slug, ord, title, topics) ON m.course_slug = c.slug;
