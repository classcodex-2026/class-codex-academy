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
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Consultation from "./pages/Consultation";
import WhatsAppEnquiry from "./pages/WhatsAppEnquiry";
import EmailEnquiry from "./pages/EmailEnquiry";
import FloatingChatWidget from "./components/FloatingChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/student/Dashboard";
import MyCourses from "./pages/student/MyCourses";
import BrowseCourses from "./pages/student/BrowseCourses";
import Profile from "./pages/student/Profile";
import Checkout from "./pages/student/Checkout";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentFailure from "./pages/student/PaymentFailure";
import CourseLearn from "./pages/student/CourseLearn";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseEdit from "./pages/admin/AdminCourseEdit";
import AdminWebinars from "./pages/admin/AdminWebinars";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminPayments from "./pages/admin/AdminPayments";

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
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/book-consultation" element={<Navigate to="/consultation" replace />} />
          <Route path="/whatsapp-enquiry" element={<WhatsAppEnquiry />} />
          <Route path="/email-enquiry" element={<EmailEnquiry />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student (protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/dashboard/browse" element={<ProtectedRoute><BrowseCourses /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/learn/:courseId" element={<ProtectedRoute><CourseLearn /></ProtectedRoute>} />
          <Route path="/checkout/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/payment-failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/:id" element={<AdminCourseEdit />} />
          <Route path="/admin/webinars" element={<AdminWebinars />} />
          <Route path="/admin/consultations" element={<AdminConsultations />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

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

          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
