import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import SuccessMetrics from "@/components/SuccessMetrics";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Navbar />
      <Hero />
      <SuccessMetrics />
      <Courses />
      <EnquiryForm />
      <Footer />
    </div>
  );
};

export default Index;
