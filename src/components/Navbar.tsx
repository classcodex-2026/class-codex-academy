import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown, User, LogOut, BookOpen, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthProvider";
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
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0] || "Student"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-foreground/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border shadow-elegant min-w-[200px]">
                  <DropdownMenuItem onClick={() => go("/dashboard")} className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go("/my-courses")} className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                    <BookOpen className="w-4 h-4 mr-2" /> My Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go("/profile")} className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer focus:bg-accent focus:text-accent-foreground text-red-500">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => go("/login")}
                  className="text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => go("/signup")}
                  className="btn-gradient border-0 rounded-full px-5 h-9 text-sm font-medium"
                >
                  Sign Up
                </Button>
              </div>
            )}
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

                {user ? (
                  <>
                    <div className="border-t border-border my-1" />
                    <button onClick={() => go("/dashboard")} className="py-2 px-2 text-foreground/80 hover:text-primary font-medium text-left flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button onClick={() => go("/my-courses")} className="py-2 px-2 text-foreground/80 hover:text-primary font-medium text-left flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> My Courses
                    </button>
                    <button onClick={() => go("/profile")} className="py-2 px-2 text-foreground/80 hover:text-primary font-medium text-left flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button onClick={handleSignOut} className="py-2 px-2 text-red-500 hover:text-red-600 font-medium text-left flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Button onClick={() => go("/login")} variant="outline" className="w-full rounded-full">
                      Login
                    </Button>
                    <Button onClick={() => go("/signup")} className="w-full btn-gradient border-0 rounded-full">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
