import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import CoursePage from "./pages/CoursePage";
import AllCourses from "./pages/AllCourses";
import Webinar from "./pages/Webinar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Consultation from "./pages/Consultation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/course/:slug" element={<CoursePage />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/book-consultation" element={<Navigate to="/consultation" replace />} />

          {/* Legacy redirects */}
          <Route path="/category/cyber-security" element={<Navigate to="/courses" replace />} />
          <Route path="/course/sql-analytics" element={<Navigate to="/course/sql" replace />} />
          <Route path="/course/sql-de" element={<Navigate to="/course/sql" replace />} />
          <Route path="/course/python-de" element={<Navigate to="/course/python" replace />} />
          <Route path="/course/python-ds" element={<Navigate to="/course/python" replace />} />
          <Route path="/course/excel-analytics" element={<Navigate to="/course/excel" replace />} />
          <Route path="/course/powerbi" element={<Navigate to="/course/power-bi" replace />} />
          <Route path="/course/ml-fundamentals" element={<Navigate to="/course/data-science" replace />} />
          <Route path="/course/statistics-ds" element={<Navigate to="/course/data-science" replace />} />
          <Route path="/course/ds-projects" element={<Navigate to="/course/data-science" replace />} />
          <Route path="/course/de-projects" element={<Navigate to="/course/aws-data-engineering" replace />} />
          <Route path="/course/da-projects" element={<Navigate to="/course/data-analytics-projects" replace />} />
          <Route path="/course/cs-fundamentals" element={<Navigate to="/courses" replace />} />
          <Route path="/course/ethical-hacking" element={<Navigate to="/courses" replace />} />
          <Route path="/course/network-security" element={<Navigate to="/courses" replace />} />
          <Route path="/course/security-projects" element={<Navigate to="/courses" replace />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
