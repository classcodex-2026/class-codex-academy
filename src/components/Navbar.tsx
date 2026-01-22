import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const courses = [
  { name: "Data Science Course", path: "/course/data-science" },
  { name: "Artificial Intelligence Course", path: "/course/ai" },
  { name: "Python Programming Course", path: "/course/python" },
  { name: "Data Engineering Course", path: "/course/data-engineering" },
  { name: "Machine Learning Course", path: "/course/machine-learning" },
  { name: "Data Analytics Course", path: "/course/data-analytics" },
  { name: "Cyber Security", path: "/course/cyber-security" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleCourseClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setCoursesOpen(false);
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
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="text-muted-foreground hover:text-primary transition-all font-medium relative group flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  Courses
                  <ChevronDown className="w-4 h-4" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-primary/20 min-w-[220px]">
                {courses.map((course) => (
                  <DropdownMenuItem
                    key={course.path}
                    onClick={() => handleCourseClick(course.path)}
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                  >
                    {course.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                <div>
                  <button
                    onClick={() => setCoursesOpen(!coursesOpen)}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium text-left flex items-center gap-1 w-full"
                  >
                    Courses
                    <ChevronDown className={`w-4 h-4 transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {coursesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 flex flex-col gap-2"
                      >
                        {courses.map((course) => (
                          <button
                            key={course.path}
                            onClick={() => handleCourseClick(course.path)}
                            className="text-muted-foreground hover:text-primary transition-colors text-sm text-left py-1"
                          >
                            {course.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
