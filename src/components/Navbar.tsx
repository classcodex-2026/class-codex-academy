import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem { label: string; path: string; }

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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setMobileCoursesOpen(false);
  };

  const isCoursesActive =
    location.pathname.startsWith("/courses") ||
    location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/course/");

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 glass-nav ${scrolled ? "glass-nav-scrolled" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <motion.button
            className="flex items-center gap-2.5 flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              Class<span className="gradient-text">Codex</span>
            </span>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`nav-link px-3 py-2 text-sm font-medium inline-flex items-center gap-1 transition-colors ${
                    isCoursesActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                  data-active={isCoursesActive}
                >
                  Courses <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-elegant min-w-[220px]">
                {coursesMenu.slice(0, 4).map((c) => (
                  <DropdownMenuItem
                    key={c.path}
                    onClick={() => go(c.path)}
                    className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                  >
                    {c.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => go("/courses")}
                  className="cursor-pointer focus:bg-accent focus:text-accent-foreground font-semibold"
                >
                  All Courses
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.slice(1).map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => go(item.path)}
                  data-active={active}
                  className={`nav-link px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Button
              asChild
              size="sm"
              className="ml-2 btn-gradient border-0 rounded-full px-5 h-9"
            >
              <a href="https://wa.me/919629997602" target="_blank" rel="noopener noreferrer">
                Enroll Now
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
              className="md:hidden py-4 border-t border-border overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                <button
                  onClick={() => setMobileCoursesOpen((v) => !v)}
                  className="py-2 px-2 text-foreground/80 hover:text-primary font-medium text-left flex items-center justify-between"
                >
                  <span>Courses</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCoursesOpen && (
                  <div className="pl-4 flex flex-col gap-1 border-l border-border ml-2">
                    {coursesMenu.map((c) => (
                      <button
                        key={c.path}
                        onClick={() => go(c.path)}
                        className="py-2 px-2 text-sm text-foreground/70 hover:text-primary text-left"
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
                    className="py-2 px-2 text-foreground/80 hover:text-primary font-medium text-left"
                  >
                    {item.label}
                  </button>
                ))}
                <Button asChild className="mt-2 w-full btn-gradient border-0">
                  <a href="https://wa.me/919629997602" target="_blank" rel="noopener noreferrer">
                    Enroll Now
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
