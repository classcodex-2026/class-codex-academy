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

          {/* Legacy route redirects */}
          <Route path="/course/data-science" element={<Navigate to="/category/data-science" replace />} />
          <Route path="/course/data-engineering" element={<Navigate to="/category/data-engineering" replace />} />
          <Route path="/course/data-analytics" element={<Navigate to="/category/data-analytics" replace />} />
          <Route path="/course/cyber-security" element={<Navigate to="/category/cyber-security" replace />} />
          <Route path="/course/machine-learning" element={<Navigate to="/course/ml-fundamentals" replace />} />
          <Route path="/course/ai" element={<Navigate to="/category/data-science" replace />} />
          <Route path="/course/sql" element={<Navigate to="/course/sql-analytics" replace />} />
          <Route path="/course/powerbi" element={<Navigate to="/course/excel-analytics" replace />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
