'use client'
import { FileText, Calendar, CheckCircle, Clock } from "lucide-react";
import StatsCard from "../../../../components/dashboard/stat_card";
import QuickAction from "../../../../components/dashboard/quick_action";
import UpcomingClasses from "../../../../components/dashboard/upcoming_classes";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6 p-6">
        {/* Welcome Section */}
        <div className="bg-linear-to-t from-sky-500 to-indigo-500 p-6 rounded-xl text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="opacity-90">
            You have 3 classes today and 2 assignments due this week.
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assignments"
          value={8}
          icon={<FileText className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend="+2 this week"
          trendUp={true}
        />
        <StatsCard
          title="Completed"
          value={6}
          icon={<CheckCircle className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend="75% completion rate"
          trendUp={true}
        />
        <StatsCard
          title="Upcoming Classes"
          value={3}
          icon={<Calendar className="h-5 w-5 text-white bg-linear-to-t from-sky-500 to-indigo-500" />}
          trend="Today"
        />
        <StatsCard
          title="Pending Tasks"
          value={2}
          icon={<Clock className="h-5 w-5 text-white " />}
          trend="Due this week"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingClasses />
        <QuickAction />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
