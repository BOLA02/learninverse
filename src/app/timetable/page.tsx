 'use client'
 import React from 'react';
 import Navbar from '../../../components/navbar/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";

const Timetable = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const schedule = {
    Monday: [
      { time: "09:00", subject: "Mathematics", location: "Room 101", type: "Lecture", duration: 2 },
      { time: "14:00", subject: "Physics Lab", location: "Lab 203", type: "Lab", duration: 2 }
    ],
    Tuesday: [
      { time: "08:00", subject: "English Literature", location: "Room 305", type: "Seminar", duration: 1 },
      { time: "11:00", subject: "Chemistry", location: "Lab 104", type: "Lecture", duration: 2 }
    ],
    Wednesday: [
      { time: "10:00", subject: "Computer Science", location: "Lab 401", type: "Practical", duration: 3 },
      { time: "15:00", subject: "History", location: "Room 201", type: "Lecture", duration: 1 }
    ],
    Thursday: [
      { time: "09:00", subject: "Mathematics", location: "Room 101", type: "Tutorial", duration: 1 },
      { time: "13:00", subject: "Biology", location: "Lab 302", type: "Lab", duration: 2 }
    ],
    Friday: [
      { time: "08:00", subject: "Philosophy", location: "Room 105", type: "Seminar", duration: 2 },
      { time: "14:00", subject: "Physics", location: "Room 203", type: "Lecture", duration: 1 }
    ]
  };

  const getClassAtTime = (day: string, time: string) => {
    const daySchedule = schedule[day as keyof typeof schedule] || [];
    return daySchedule.find(cls => cls.time === time);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      Lecture: "bg-blue-100 text-blue-800 border-blue-200",
      Lab: "bg-green-100 text-green-800 border-green-200",
      Practical: "bg-purple-100 text-purple-800 border-purple-200",
      Seminar: "bg-orange-100 text-orange-800 border-orange-200",
      Tutorial: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6 ">
      <Navbar />
      {/* Header */}
      <div className="flex items-center justify-between m-10">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Timetable</h1>
          <p className="text-muted-foreground">View your class schedule</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">Week {currentWeek + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(currentWeek + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timetable */}
      <Card className="shadow-card m-10 p-5">
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
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
                <React.Fragment key={time}>
                  <div key={time} className="p-3 text-center text-sm text-muted-foreground border-r">
                    {time}
                  </div>
                  {days.map(day => {
                    const classInfo = getClassAtTime(day, time);
                    return (
                      <div key={`${day}-${time}`} className="p-2 min-h-[80px] border-r border-b">
                        {classInfo && (
                          <div className={`p-3 rounded-lg border ${getClassAtTime(day, time)?.duration === 1 ? 'h-full' : 'h-full'}`}>
                            <div className={`${getTypeColor(classInfo.type)} p-2 rounded-md h-full`}>
                              <h4 className="font-medium text-xs mb-1">{classInfo.subject}</h4>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1 text-xs">
                                  <MapPin className="h-3 w-3" />
                                  <span>{classInfo.location}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs">
                                  <Clock className="h-3 w-3" />
                                  <span>{classInfo.duration}h</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {classInfo.type}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-card m-10">
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {["Lecture", "Lab", "Practical", "Seminar", "Tutorial"].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${getTypeColor(type).split(' ')[0]}`}></div>
                <span className="text-sm text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
 