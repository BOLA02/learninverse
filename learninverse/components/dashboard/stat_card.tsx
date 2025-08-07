import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("shadow-card hover:shadow-elegant transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn( "text-xs font-medium", trendUp ? "text-green-600" : "text-red-600")}>
                {trend}
              </p>
            )}
          </div>
          <div className=" p-3 bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;