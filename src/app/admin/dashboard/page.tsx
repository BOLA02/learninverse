'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Courses',
      value: '45',
      change: '+3',
      trend: 'up',
      icon: BookOpen,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments',
      value: '189',
      change: '+23',
      trend: 'up',
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Classes Today',
      value: '28',
      change: '-2',
      trend: 'down',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New student enrolled',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'enrollment'
    },
    {
      id: 2,
      action: 'Assignment submitted',
      user: 'Jane Smith',
      time: '5 minutes ago',
      type: 'assignment'
    },
    {
      id: 3,
      action: 'Course updated',
      user: 'Dr. Wilson',
      time: '10 minutes ago',
      type: 'course'
    },
    {
      id: 4,
      action: 'New announcement posted',
      user: 'Admin',
      time: '15 minutes ago',
      type: 'announcement'
    }
  ];

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Welcome to the admin dashboard. Here's what's happening today."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <p className="font-medium text-sm">Add Student</p>
                  <p className="text-xs text-muted-foreground">Enroll new student</p>
                </button>
                <button className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <BookOpen className="h-6 w-6 text-primary mb-2" />
                  <p className="font-medium text-sm">Create Course</p>
                  <p className="text-xs text-muted-foreground">Add new course</p>
                </button>
                <button className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <FileText className="h-6 w-6 text-primary mb-2" />
                  <p className="font-medium text-sm">New Assignment</p>
                  <p className="text-xs text-muted-foreground">Create assignment</p>
                </button>
                <button className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-left">
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <p className="font-medium text-sm">Schedule Class</p>
                  <p className="text-xs text-muted-foreground">Add to timetable</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
