import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Search, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { to: "/dashboard/browse", label: "Browse Courses", icon: Search },
  { to: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

const StudentLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl gradient-text">ClassCodex</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 h-fit bg-white rounded-xl border p-3">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                  }`
                }>
                <Icon className="w-4 h-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;
