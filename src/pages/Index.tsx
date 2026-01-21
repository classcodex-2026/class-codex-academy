import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Courses from "@/components/Courses";
import SuccessMetrics from "@/components/SuccessMetrics";
import WhyClassCodex from "@/components/WhyClassCodex";
import EnquiryForm from "@/components/EnquiryForm";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <div className="relative z-10">
        <AnnouncementBanner />
        <Navbar />
        <Hero />
        <SuccessMetrics />
        <Courses />
        <WhyClassCodex />
        <EnquiryForm />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
