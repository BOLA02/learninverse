'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Eye
} from 'lucide-react';

const TeacherCourses = () => {
  const { user } = useAuth();

  const courses = [
    {
      id: '1',
      name: 'Computer Science Fundamentals',
      code: 'CS101',
      students: 45,
      semester: 'Fall 2024',
      status: 'active',
      schedule: 'Mon, Wed, Fri - 10:00 AM'
    },
    {
      id: '2',
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      students: 38,
      semester: 'Fall 2024',
      status: 'active',
      schedule: 'Tue, Thu - 2:00 PM'
    },
    {
      id: '3',
      name: 'Database Systems',
      code: 'CS301',
      students: 32,
      semester: 'Fall 2024',
      status: 'active',
      schedule: 'Mon, Wed - 4:00 PM'
    }
  ];

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground">Manage your courses and students</p>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{course.code}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students} students</span>
                    </div>
                    <span className="text-muted-foreground">{course.semester}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{course.schedule}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherCourses;
