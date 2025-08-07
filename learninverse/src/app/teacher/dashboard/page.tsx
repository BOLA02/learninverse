'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    {
      title: 'My Courses',
      value: '3',
      change: '+1 this semester',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Students',
      value: '127',
      change: '+12 new enrollments',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Assignments',
      value: '8',
      change: '3 pending review',
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Classes This Week',
      value: '12',
      change: '2 upcoming today',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New assignment submitted',
      student: 'Alex Johnson',
      course: 'CS101',
      time: '2 minutes ago',
      type: 'submission'
    },
    {
      id: 2,
      action: 'Student enrolled in course',
      student: 'Jane Smith',
      course: 'MATH101',
      time: '1 hour ago',
      type: 'enrollment'
    },
    {
      id: 3,
      action: 'Assignment deadline approaching',
      student: 'All students',
      course: 'CS101',
      time: '2 hours ago',
      type: 'reminder'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Computer Science Fundamentals',
      time: '10:00 AM',
      room: 'Lab 401',
      students: 45,
      type: 'Lecture'
    },
    {
      id: 2,
      subject: 'Data Structures',
      time: '2:00 PM',
      room: 'Room 201',
      students: 38,
      type: 'Tutorial'
    },
    {
      id: 3,
      subject: 'Programming Lab',
      time: '4:00 PM',
      room: 'Lab 302',
      students: 25,
      type: 'Practical'
    }
  ];

  return (
    <ProtectedRoute requiredRole="teacher">
      <div>
        {/* Navigation */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-6 rounded-xl text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Teacher'}!</h1>
          <p className="opacity-90">
            You have 3 classes today and 12 assignments to review.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.change}</p>
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
          {/* Today's Classes */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{classItem.time}</span>
                        </div>
                        <span>{classItem.room}</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{classItem.students} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {classItem.type}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'submission' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'enrollment' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'reminder' && (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">{activity.student}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.course}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Create Assignment</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">View Students</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Manage Courses</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule Class</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherDashboard;
