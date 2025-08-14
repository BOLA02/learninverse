'use client';
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  FileText,
  BookOpen,
  Menu,
  X,
  GraduationCap,
  LogOut,
  User,
  Settings,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isStudent, isTeacher } = useAuth();

  // Role-based navigation items
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
        { href: "/admin/users", icon: User, label: "Users" },
        { href: "/admin/courses", icon: BookOpen, label: "Courses" },
        { href: "/admin/assignments", icon: FileText, label: "Assignments" },
        { href: "/admin/timetable", icon: Calendar, label: "Timetable" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ];
    } else if (isTeacher) {
      return [
        { href: "/teacher/dashboard", icon: Home, label: "Dashboard" },
        { href: "/teacher/courses", icon: BookOpen, label: "My Courses" },
        { href: "/teacher/assignments", icon: FileText, label: "Assignments" },
        { href: "/teacher/timetable", icon: Calendar, label: "Schedule" },
      ];
    } else {
      return [
        { href: "/pages/dashboard", icon: Home, label: "Dashboard" },
        { href: "/timetable", icon: Calendar, label: "Timetable" },
        { href: "/assignment", icon: FileText, label: "Assignments" },
        { href: "/note", icon: BookOpen, label: "Notes" },
        { href: "/chat", icon: MessageSquare, label: "Chat" },
      ];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className=" p-2 bg-linear-to-t from-sky-500 to-indigo-500  p-4 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">StudentHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-linear-to-t from-sky-500 to-indigo-500 text-white shadow-elegant"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user.displayName || user.email || "Student"}</p>
                  {/* <p className="text-xs text-muted-foreground capitalize">{user.role}</p> */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile User Profile & Logout */}
              {user && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="px-3 py-2">
                    <p className="font-medium text-foreground">{user.displayName || user.email || "Student"}</p>
                    {/* <p className="text-xs text-muted-foreground capitalize">{user.role}</p> */}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
