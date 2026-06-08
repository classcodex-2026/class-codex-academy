import { ReactNode } from "react";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  MessageSquare,
  Settings,
  LogOut,
  Loader2,
  Users,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/webinars", label: "Webinars", icon: Video },
  { to: "/admin/consultations", label: "Consultations", icon: MessageSquare },
  { to: "/admin/settings", label: "Website Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            Your account does not have admin privileges.
          </p>
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/admin/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin" className="font-bold text-lg tracking-tight">
            ClassCodex <span className="text-primary">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
