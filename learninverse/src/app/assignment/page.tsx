'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '../../../components/navbar/navigation'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Plus
} from "lucide-react";
import { toast } from "sonner";

const Assignment = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null
  });
//   const { toast } = toast();

  const assignments = [
    {
      id: 1,
      title: "Mathematics Assignment 1",
      subject: "Mathematics",
      dueDate: "2024-01-25",
      status: "pending",
      description: "Solve calculus problems from chapter 3"
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-01-20",
      status: "submitted",
      description: "Write a detailed report on the pendulum experiment"
    },
    {
      id: 3,
      title: "Literature Essay",
      subject: "English Literature",
      dueDate: "2024-01-30",
      status: "pending",
      description: "Write a 1500-word essay on Shakespeare's Hamlet"
    },
    {
      id: 4,
      title: "Chemistry Research",
      subject: "Chemistry",
      dueDate: "2024-01-15",
      status: "overdue",
      description: "Research paper on organic compounds"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Assignment Submitted: Your assignment has been submitted successfully!");
    setShowSubmissionForm(false);
    setFormData({ title: "", description: "", file: null });
  };
   /**
 * Renders the Assignments page, allowing users to view, manage, and submit assignments.
 * Displays a list of assignments with status indicators and provides a form for submitting new assignments,
 * including file upload and validation. Utilizes organization-specific UI components and icons.
 */
  return (
    <div className="space-y-6 ">
      {/* Header */}
      <Navbar />
      <div className="flex items-center justify-between m-5 p-5">
        <div>
          <h1 className="text-2xl font-bold text-black">Assignments</h1>
          <p className="text-black">Manage and submit your assignments</p>
        </div>
        <Button 
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
          className="bg-linear-to-t from-sky-500 to-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Assignment
        </Button>
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
        <Card className="bg-[#ffffff] p-5 m-5">
          <CardHeader>
            <CardTitle>Submit New Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 m-8 p-5">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter assignment description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                    </p>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-gradient-primary">
                  Submit Assignment
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="grid gap-4 m-5 p-5">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                    <Badge className={getStatusColor(assignment.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(assignment.status)}
                        <span className="capitalize">{assignment.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {assignment.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <Badge variant="outline">
                      {assignment.subject}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {assignment.status === "pending" && (
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignment;