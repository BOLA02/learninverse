'use client';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface ClassSchedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  instructor: string;
  room: string;
  duration: number;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar' | 'Practical';
  course: string;
  students: number;
}

const TimetableManagement = () => {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([
    {
      id: '1',
      day: 'Monday',
      time: '09:00',
      subject: 'Mathematics',
      instructor: 'Dr. Sarah Wilson',
      room: 'Room 101',
      duration: 2,
      type: 'Lecture',
      course: 'MATH101',
      students: 38
    },
    {
      id: '2',
      day: 'Monday',
      time: '14:00',
      subject: 'Physics Lab',
      instructor: 'Dr. Michael Brown',
      room: 'Lab 203',
      duration: 2,
      type: 'Lab',
      course: 'PHYS201',
      students: 25
    },
    {
      id: '3',
      day: 'Tuesday',
      time: '08:00',
      subject: 'English Literature',
      instructor: 'Prof. Jane Smith',
      room: 'Room 305',
      duration: 1,
      type: 'Seminar',
      course: 'ENG101',
      students: 30
    },
    {
      id: '4',
      day: 'Tuesday',
      time: '11:00',
      subject: 'Chemistry',
      instructor: 'Dr. Robert Davis',
      room: 'Lab 104',
      duration: 2,
      type: 'Lecture',
      course: 'CHEM101',
      students: 35
    },
    {
      id: '5',
      day: 'Wednesday',
      time: '10:00',
      subject: 'Computer Science',
      instructor: 'Dr. John Smith',
      room: 'Lab 401',
      duration: 3,
      type: 'Practical',
      course: 'CS101',
      students: 45
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    instructor: '',
    room: '',
    duration: 1,
    type: 'Lecture' as ClassSchedule['type'],
    course: '',
    students: 0
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  const classTypes: ClassSchedule['type'][] = ['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Practical'];
  const rooms = [
    'Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301', 'Room 305',
    'Lab 104', 'Lab 203', 'Lab 302', 'Lab 401', 'Auditorium A', 'Auditorium B'
  ];
  const courses = ['CS101', 'MATH101', 'PHYS201', 'CHEM101', 'ENG101'];

  const getClassAtTime = (day: string, time: string) => {
    return schedule.find(cls => cls.day === day && cls.time === time);
  };

  const getTypeColor = (type: ClassSchedule['type']) => {
    switch (type) {
      case 'Lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Lab':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Tutorial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Seminar':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Practical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for conflicts
    const conflict = schedule.find(cls => 
      cls.day === formData.day && 
      cls.time === formData.time && 
      cls.id !== editingClass?.id
    );
    
    if (conflict) {
      toast.error('Time slot conflict! Another class is scheduled at this time.');
      return;
    }

    // Check room availability
    const roomConflict = schedule.find(cls => 
      cls.day === formData.day && 
      cls.time === formData.time && 
      cls.room === formData.room && 
      cls.id !== editingClass?.id
    );
    
    if (roomConflict) {
      toast.error('Room conflict! This room is already booked at this time.');
      return;
    }
    
    if (editingClass) {
      // Update existing class
      const updatedSchedule = schedule.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...formData }
          : cls
      );
      setSchedule(updatedSchedule);
      toast.success('Class updated successfully!');
    } else {
      // Add new class
      const newClass: ClassSchedule = {
        id: Date.now().toString(),
        ...formData
      };
      setSchedule([...schedule, newClass]);
      toast.success('Class added successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      day: '',
      time: '',
      subject: '',
      instructor: '',
      room: '',
      duration: 1,
      type: 'Lecture',
      course: '',
      students: 0
    });
    setShowAddForm(false);
    setEditingClass(null);
  };

  const handleEdit = (classItem: ClassSchedule) => {
    setEditingClass(classItem);
    setFormData({
      day: classItem.day,
      time: classItem.time,
      subject: classItem.subject,
      instructor: classItem.instructor,
      room: classItem.room,
      duration: classItem.duration,
      type: classItem.type,
      course: classItem.course,
      students: classItem.students
    });
    setShowAddForm(true);
  };

  const handleDelete = (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setSchedule(schedule.filter(cls => cls.id !== classId));
      toast.success('Class deleted successfully!');
    }
  };

  return (
    <AdminLayout 
      title="Timetable Management" 
      description="Create and manage class schedules, rooms, and time slots"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {/* Add/Edit Class Form */}
        {showAddForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map(room => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Class Type</Label>
                    <Select value={formData.type} onValueChange={(value: ClassSchedule['type']) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {classTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="students">Number of Students</Label>
                    <Input
                      id="students"
                      type="number"
                      min="1"
                      value={formData.students}
                      onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingClass ? 'Update Class' : 'Add Class'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Timetable Grid */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Timetable</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                {/* Header */}
                <div className="p-3 text-center font-medium text-muted-foreground border-b">
                  Time
                </div>
                {days.map(day => (
                  <div key={day} className="p-3 text-center font-medium text-foreground border-b">
                    {day}
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(time => (
                  <div key={time} className="contents">
                    <div className="p-3 text-center text-sm text-muted-foreground border-r">
                      {time}
                    </div>
                    {days.map(day => {
                      const classInfo = getClassAtTime(day, time);
                      return (
                        <div key={`${day}-${time}`} className="p-2 min-h-[100px] border-r border-b">
                          {classInfo && (
                            <div className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow group">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{classInfo.subject}</h4>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEdit(classInfo)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDelete(classInfo.id)}
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span>{classInfo.room}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span>{classInfo.duration}h</span>
                                  </div>
                                  <p className="text-muted-foreground">{classInfo.instructor}</p>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Badge className={getTypeColor(classInfo.type)} variant="outline">
                                    {classInfo.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {classInfo.students} students
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Class Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {classTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border ${getTypeColor(type)}`}></div>
                  <span className="text-sm text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TimetableManagement;
