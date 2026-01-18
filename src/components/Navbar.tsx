import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ClassCodex</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("courses")}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection("enquiry")}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            <Button onClick={() => scrollToSection("enquiry")}>
              Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("courses")}
                className="text-muted-foreground hover:text-primary transition-colors font-medium text-left"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("enquiry")}
                className="text-muted-foreground hover:text-primary transition-colors font-medium text-left"
              >
                Contact
              </button>
              <Button onClick={() => scrollToSection("enquiry")} className="w-full">
                Enroll Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
