import CourseSyllabusPage, { CourseSyllabusData } from "@/components/CourseSyllabusPage";

const data: CourseSyllabusData = {
  name: "Power BI",
  tagline: "Business Intelligence — Complete Syllabus",
  status: "Open for Enrollment",
  duration: "4 Weeks",
  price: 999,
  originalPrice: 3999,
  overview:
    "Build interactive dashboards and reports with Microsoft Power BI — from connecting data sources to publishing enterprise-grade BI solutions.",
  outcomes: [
    "Connect and transform data from multiple sources",
    "Master DAX for calculated columns and measures",
    "Build interactive dashboards and reports",
    "Use bookmarks, drill-throughs and tooltips",
    "Publish and share reports on Power BI Service",
    "Implement Row-Level Security",
  ],
  prerequisites: ["Basic Excel knowledge", "No prior BI experience required"],
  projects: [
    "Sales performance dashboard",
    "HR analytics report with RLS",
    "Executive KPI dashboard with drill-down",
  ],
  certification:
    "Receive a Class Codex Power BI completion certificate and preparation guidance for the Microsoft PL-300 certification.",
  modules: [
    { title: "Module 1: Introduction to Business Intelligence", topics: ["BI landscape", "Power BI ecosystem", "Installing Power BI Desktop"] },
    { title: "Module 2: Power BI Desktop Overview", topics: ["UI walkthrough", "Report, Data, Model views"] },
    { title: "Module 3: Connecting to Data Sources", topics: ["Files, Databases, Web, APIs", "Direct Query vs Import"] },
    { title: "Module 4: Data Transformation with Power Query", topics: ["M language basics", "Merging & appending queries", "Data cleaning"] },
    { title: "Module 5: DAX Fundamentals", topics: ["Calculated columns vs measures", "Filter context", "Time intelligence"] },
    { title: "Module 6: Creating Visualizations & Charts", topics: ["Core visuals", "Custom visuals", "Conditional formatting"] },
    { title: "Module 7: Building Interactive Dashboards", topics: ["Slicers, bookmarks, drill-through", "Tooltips & navigation"] },
    { title: "Module 8: Publishing & Sharing Reports", topics: ["Power BI Service", "Workspaces & Apps", "Scheduled refresh"] },
    { title: "Module 9: Service & Collaboration", topics: ["Row-Level Security", "Gateways", "Governance"] },
  ],
  faqs: [
    { q: "Do I need Excel skills?", a: "Basic Excel familiarity is enough to get started." },
    { q: "Will we cover DAX?", a: "Yes, DAX is covered in depth with hands-on exercises." },
    { q: "Is Power BI Pro license required?", a: "Desktop is free; we use trial accounts for the Service portion." },
    { q: "Will I receive a certificate?", a: "Yes, after completing modules and the capstone project." },
  ],
};

const PowerBICourse = () => <CourseSyllabusPage data={data} />;
export default PowerBICourse;
