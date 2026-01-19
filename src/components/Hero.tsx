import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";
import heroTechCloud from "@/assets/hero-tech-cloud.png";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] hero-gradient overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNS41MjMgMC0xMC00LjQ3Ny0xMC0xMHM0LjQ3Ny0xMCAxMC0xMCAxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">A Guiding Platform for Aspiring Data Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Grow Your Data Skills With Our{" "}
              <span className="text-primary">Affordable</span>{" "}
              Courses
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">R</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
              </div>
              <div>
                <p className="text-white font-semibold">Join Achievers Castle</p>
                <p className="text-white/70 text-sm">Who have successfully cracked their dream jobs</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => scrollToSection("courses")}
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="heroOutline" 
                size="lg"
                onClick={() => scrollToSection("enquiry")}
              >
                Request a Callback
              </Button>
            </div>
          </div>
          
          {/* Right Content - Tech Cloud Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <img 
                src={heroTechCloud} 
                alt="Data Science and Tech Tools Word Cloud" 
                className="w-full h-auto drop-shadow-2xl animate-float"
              />
              {/* Floating icons around the image */}
              <div className="absolute -top-4 left-10 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow">
                <span className="text-2xl">🐍</span>
              </div>
              <div className="absolute top-1/4 -right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow delay-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow delay-200">
                <span className="text-2xl">❄️</span>
              </div>
              <div className="absolute -bottom-4 right-10 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow delay-300">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
