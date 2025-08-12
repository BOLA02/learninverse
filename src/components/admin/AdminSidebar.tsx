'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Calendar,
  Settings,
  BarChart3,
  Bell,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  School
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and statistics'
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage students, teachers, and admins'
    },
    {
      title: 'Courses & Subjects',
      href: '/admin/courses',
      icon: BookOpen,
      description: 'Academic programs and subjects'
    },
    {
      title: 'Assignments',
      href: '/admin/assignments',
      icon: FileText,
      description: 'Assignment management and grading'
    },
    {
      title: 'Timetable',
      href: '/admin/timetable',
      icon: Calendar,
      description: 'Schedule and room management'
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Reports and performance metrics'
    },
    {
      title: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      description: 'System announcements and alerts'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className={cn(
      "bg-card border-r border-border h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Learninverse</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
              isActive(item.href)
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive(item.href) ? "text-white" : "text-muted-foreground group-hover:text-foreground"
            )} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.title}</p>
                {!isActive(item.href) && (
                  <p className="text-xs text-muted-foreground/70 truncate">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            <p>Admin Dashboard v1.0</p>
            <p>© 2024 Learninverse</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
