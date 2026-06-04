import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogIn, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Webinars", path: "/webinar" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const coursesMenu = [
  { label: "Python Programming", path: "/category/python-programming" },
  { label: "Data Engineering", path: "/category/data-engineering" },
  { label: "Data Analytics", path: "/category/data-analytics" },
  { label: "Data Science", path: "/category/data-science" },
  { label: "All Courses", path: "/courses" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setMobileCoursesOpen(false);
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

  const isCoursesActive =
    location.pathname.startsWith("/courses") ||
    location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/course/");

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
            <button
              onClick={() => go("/")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Home
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                    isCoursesActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Courses <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-primary/20 min-w-[220px]">
                {coursesMenu.slice(0, 4).map((c) => (
                  <DropdownMenuItem
                    key={c.path}
                    onClick={() => go(c.path)}
                    className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                  >
                    {c.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem
                  onClick={() => go("/courses")}
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary font-semibold"
                >
                  All Courses
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.slice(1).map((item) => (
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
              asChild
              size="sm"
              className="ml-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              <a
                href="https://wa.me/919442150416?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20in%20a%20course%20at%20ClassCodex.%20Please%20share%20course%20details%2C%20fees%2C%20and%20upcoming%20batches."
                target="_blank"
                rel="noopener noreferrer"
              >
                Enroll
              </a>
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
              className="md:hidden py-4 border-t border-primary/10 overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                <button
                  onClick={() => go("/")}
                  className="py-2 px-2 text-muted-foreground hover:text-primary font-medium text-left"
                >
                  Home
                </button>

                <button
                  onClick={() => setMobileCoursesOpen((v) => !v)}
                  className="py-2 px-2 text-muted-foreground hover:text-primary font-medium text-left flex items-center justify-between"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileCoursesOpen && (
                  <div className="pl-4 flex flex-col gap-1 border-l border-primary/10 ml-2">
                    {coursesMenu.map((c) => (
                      <button
                        key={c.path}
                        onClick={() => go(c.path)}
                        className="py-2 px-2 text-sm text-muted-foreground hover:text-primary text-left"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}

                {navItems.slice(1).map((item) => (
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
                  asChild
                  className="mt-1 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a
                    href="https://wa.me/919442150416?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20in%20a%20course%20at%20ClassCodex.%20Please%20share%20course%20details%2C%20fees%2C%20and%20upcoming%20batches."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enroll
                  </a>
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
