import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Webinars", path: "/webinar" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const scrollToEnquiry = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" });
    }
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
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 xl:gap-2 justify-end">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.path)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => go("/login")}
              className="ml-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
            >
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Button>
            <Button
              onClick={scrollToEnquiry}
              size="sm"
              className="ml-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-button"
            >
              Enroll
            </Button>
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-primary/10 overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => go(item.path)}
                    className="py-2 px-2 text-muted-foreground hover:text-primary font-medium text-left"
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => go("/login")}
                  className="mt-3 w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Button>
                <Button
                  onClick={scrollToEnquiry}
                  className="mt-1 w-full bg-primary text-primary-foreground"
                >
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
