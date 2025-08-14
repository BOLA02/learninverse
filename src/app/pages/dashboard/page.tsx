'use client'
import { FileText, Calendar, CheckCircle, Clock } from "lucide-react";
import StatsCard from "../../../../components/dashboard/stat_card";
import QuickAction from "../../../../components/dashboard/quick_action";
import NoteForm from "@/app/components/student/NoteForm";
import UpcomingClasses from "../../../../components/dashboard/upcoming_classes";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const { user } = useAuth();
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [completedAssignments, setCompletedAssignments] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      setLoading(true);
      // Fetch assignments
      const assignmentsRef = collection(db, "assignments");
      const q = query(assignmentsRef, where("studentId", "==", user.uid));
      const snapshot = await getDocs(q);
      const assignments = snapshot.docs.map(doc => doc.data());
      setTotalAssignments(assignments.length);
      setCompletedAssignments(assignments.filter(a => a.status === "completed").length);
      setPendingAssignments(assignments.filter(a => a.status === "pending").length);

      // Fetch upcoming classes (date >= today)
      const classesRef = collection(db, "classes");
      const today = new Date().toISOString().split("T")[0];
      const cq = query(classesRef, where("studentId", "==", user.uid));
      const classSnapshot = await getDocs(cq);
      const classes = classSnapshot.docs.map(doc => doc.data());
      setUpcomingClasses(classes.filter(c => c.date >= today).length);
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6 p-6">
        {/* Welcome Section */}
        <div className="bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-xl text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName || user?.email || 'Student'}!</h1>
          <p className="opacity-90">
            {loading
              ? 'Loading your stats...'
              : `You have ${upcomingClasses} classes today and ${pendingAssignments} assignments due this week.`}
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assignments"
          value={totalAssignments}
          icon={<FileText className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend={loading ? "" : `+${pendingAssignments} pending`}
          trendUp={pendingAssignments > 0}
        />
        <StatsCard
          title="Completed"
          value={completedAssignments}
          icon={<CheckCircle className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend={loading ? "" : `${totalAssignments > 0 ? Math.round((completedAssignments/totalAssignments)*100) : 0}% completion rate`}
          trendUp={completedAssignments > 0}
        />
        <StatsCard
          title="Upcoming Classes"
          value={upcomingClasses}
          icon={<Calendar className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend={loading ? "" : "Today or later"}
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingAssignments}
          icon={<Clock className="h-5 w-5 text-white " />}
          trend={loading ? "" : "Due this week"}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClasses />
        <QuickAction />
      </div>

      {/* Note Form Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Send a Note to Another Student</h2>
        <NoteForm />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
