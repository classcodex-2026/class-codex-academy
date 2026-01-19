import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import SuccessMetrics from "@/components/SuccessMetrics";
import WhyClassCodex from "@/components/WhyClassCodex";
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
      <WhyClassCodex />
      <EnquiryForm />
      <Footer />
    </div>
  );
};

export default Index;
