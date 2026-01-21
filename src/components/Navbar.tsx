import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-primary/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <GraduationCap className="w-6 h-6 text-black relative z-10" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-wider">
              Class<span className="text-primary">Codex</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <motion.button
              onClick={() => scrollToSection("courses")}
              className="text-muted-foreground hover:text-primary transition-all font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>
            <motion.button
              onClick={() => scrollToSection("enquiry")}
              className="text-muted-foreground hover:text-primary transition-all font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>
            <Button 
              onClick={() => scrollToSection("enquiry")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-button"
            >
              Enroll Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-primary/10 overflow-hidden"
            >
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
                <Button onClick={() => scrollToSection("enquiry")} className="w-full bg-primary text-primary-foreground">
                  Enroll Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
