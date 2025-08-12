'use client';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  totalPoints: number;
  submissionType: 'file' | 'text' | 'both';
  status: 'draft' | 'published' | 'closed';
  submissions: number;
  totalStudents: number;
  createdAt: string;
  createdBy: string;
}

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Programming Fundamentals Quiz',
      description: 'Basic programming concepts and syntax',
      course: 'CS101',
      dueDate: '2024-02-15',
      totalPoints: 100,
      submissionType: 'both',
      status: 'published',
      submissions: 42,
      totalStudents: 45,
      createdAt: '2024-01-20',
      createdBy: 'Dr. John Smith'
    },
    {
      id: '2',
      title: 'Calculus Problem Set 3',
      description: 'Integration and differentiation problems',
      course: 'MATH101',
      dueDate: '2024-02-20',
      totalPoints: 50,
      submissionType: 'file',
      status: 'published',
      submissions: 35,
      totalStudents: 38,
      createdAt: '2024-01-25',
      createdBy: 'Dr. Sarah Wilson'
    },
    {
      id: '3',
      title: 'Lab Report: Pendulum Experiment',
      description: 'Analyze pendulum motion data and write a comprehensive report',
      course: 'PHYS201',
      dueDate: '2024-02-25',
      totalPoints: 75,
      submissionType: 'file',
      status: 'draft',
      submissions: 0,
      totalStudents: 25,
      createdAt: '2024-01-28',
      createdBy: 'Dr. Michael Brown'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    totalPoints: 100,
    submissionType: 'both' as Assignment['submissionType'],
    status: 'draft' as Assignment['status']
  });

  const courses = ['CS101', 'MATH101', 'PHYS201', 'CHEM101', 'ENG101'];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'all' || assignment.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadgeColor = (status: Assignment['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubmissionProgress = (submissions: number, total: number) => {
    const percentage = total > 0 ? (submissions / total) * 100 : 0;
    return {
      percentage: Math.round(percentage),
      color: percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAssignment) {
      // Update existing assignment
      const updatedAssignments = assignments.map(assignment => 
        assignment.id === editingAssignment.id 
          ? { 
              ...assignment, 
              ...formData
            }
          : assignment
      );
      setAssignments(updatedAssignments);
      toast.success('Assignment updated successfully!');
    } else {
      // Add new assignment
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        ...formData,
        submissions: 0,
        totalStudents: 45, // Mock value
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Current Admin'
      };
      setAssignments([...assignments, newAssignment]);
      toast.success('Assignment created successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      dueDate: '',
      totalPoints: 100,
      submissionType: 'both',
      status: 'draft'
    });
    setShowAddForm(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course,
      dueDate: assignment.dueDate,
      totalPoints: assignment.totalPoints,
      submissionType: assignment.submissionType,
      status: assignment.status
    });
    setShowAddForm(true);
  };

  const handleDelete = (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      toast.success('Assignment deleted successfully!');
    }
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { 
            ...assignment, 
            status: assignment.status === 'published' ? 'closed' : 'published' as Assignment['status']
          }
        : assignment
    );
    setAssignments(updatedAssignments);
    toast.success('Assignment status updated!');
  };

  return (
    <AdminLayout 
      title="Assignment Management" 
      description="Create, manage, and grade assignments across all courses"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        {/* Add/Edit Assignment Form */}
        {showAddForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalPoints">Total Points</Label>
                    <Input
                      id="totalPoints"
                      type="number"
                      min="1"
                      value={formData.totalPoints}
                      onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="submissionType">Submission Type</Label>
                    <Select value={formData.submissionType} onValueChange={(value: Assignment['submissionType']) => setFormData({ ...formData, submissionType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="file">File Upload</SelectItem>
                        <SelectItem value="text">Text Entry</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: Assignment['status']) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const progress = getSubmissionProgress(assignment.submissions, assignment.totalStudents);
            const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'published';
            
            return (
              <Card key={assignment.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground text-lg">{assignment.title}</h3>
                        <Badge className={getStatusBadgeColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                        {isOverdue && (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{assignment.course}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Points:</span>
                          <span className="font-medium">{assignment.totalPoints}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className={progress.color}>
                            {assignment.submissions}/{assignment.totalStudents} ({progress.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(assignment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAssignmentStatus(assignment.id)}
                        className={assignment.status === 'published' ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      >
                        {assignment.status === 'published' ? 'Close' : 'Publish'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AssignmentManagement;
