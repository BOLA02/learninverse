'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus,
  Calendar,
  Users,
  Eye,
  Edit
} from 'lucide-react';

const TeacherAssignments = () => {
  const assignments = [
    {
      id: '1',
      title: 'Programming Fundamentals Quiz',
      course: 'CS101',
      dueDate: '2024-02-15',
      submissions: 42,
      totalStudents: 45,
      status: 'active'
    },
    {
      id: '2',
      title: 'Data Structures Project',
      course: 'CS201',
      dueDate: '2024-02-20',
      submissions: 35,
      totalStudents: 38,
      status: 'active'
    },
    {
      id: '3',
      title: 'Database Design Assignment',
      course: 'CS301',
      dueDate: '2024-02-25',
      submissions: 28,
      totalStudents: 32,
      status: 'active'
    }
  ];

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Assignments</h1>
            <p className="text-muted-foreground">Create and manage assignments</p>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{assignment.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{assignment.course}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.submissions}/{assignment.totalStudents} submitted</span>
                      </div>
                      <div className="text-muted-foreground">
                        {Math.round((assignment.submissions / assignment.totalStudents) * 100)}% completion
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
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

export default TeacherAssignments;
