'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  MapPin,
  Users
} from 'lucide-react';

const TeacherTimetable = () => {
  const schedule = {
    Monday: [
      { time: "10:00", subject: "Computer Science Fundamentals", location: "Lab 401", students: 45, duration: 2 },
      { time: "16:00", subject: "Database Systems", location: "Room 201", students: 32, duration: 2 }
    ],
    Tuesday: [
      { time: "14:00", subject: "Data Structures", location: "Lab 302", students: 38, duration: 2 }
    ],
    Wednesday: [
      { time: "10:00", subject: "Computer Science Fundamentals", location: "Lab 401", students: 45, duration: 2 },
      { time: "16:00", subject: "Database Systems", location: "Room 201", students: 32, duration: 2 }
    ],
    Thursday: [
      { time: "14:00", subject: "Data Structures", location: "Lab 302", students: 38, duration: 2 }
    ],
    Friday: [
      { time: "10:00", subject: "Computer Science Fundamentals", location: "Lab 401", students: 45, duration: 2 }
    ]
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">View your teaching schedule</p>
        </div>

        {/* Timetable */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Schedule</span>
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
                      const classInfo = schedule[day as keyof typeof schedule]?.find(c => c.time === time);
                      return (
                        <div key={`${day}-${time}`} className="p-2 min-h-[100px] border-r border-b">
                          {classInfo && (
                            <div className="p-3 rounded-lg border bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200 h-full">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-foreground">{classInfo.subject}</h4>
                                
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span>{classInfo.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span>{classInfo.duration}h</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-3 w-3 text-muted-foreground" />
                                    <span>{classInfo.students} students</span>
                                  </div>
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

        {/* Today's Classes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.Monday.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{classItem.time}</span>
                      </div>
                      <span>{classItem.location}</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{classItem.students} students</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {classItem.duration}h
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherTimetable;
