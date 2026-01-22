import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PythonCourse from "./pages/PythonCourse";
import DataScienceCourse from "./pages/DataScienceCourse";
import AICourse from "./pages/AICourse";
import DataEngineeringCourse from "./pages/DataEngineeringCourse";
import MLCourse from "./pages/MLCourse";
import DataAnalyticsCourse from "./pages/DataAnalyticsCourse";
import CyberSecurityCourse from "./pages/CyberSecurityCourse";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course/python" element={<PythonCourse />} />
          <Route path="/course/data-science" element={<DataScienceCourse />} />
          <Route path="/course/ai" element={<AICourse />} />
          <Route path="/course/data-engineering" element={<DataEngineeringCourse />} />
          <Route path="/course/machine-learning" element={<MLCourse />} />
          <Route path="/course/data-analytics" element={<DataAnalyticsCourse />} />
          <Route path="/course/cyber-security" element={<CyberSecurityCourse />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
