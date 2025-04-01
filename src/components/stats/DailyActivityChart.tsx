
import { useMemo, useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { TaskStatsCard } from "./TaskStatsCard";
import { 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface DailyActivityChartProps {
  /** List of all tasks to analyze */
  tasks: Task[];
}

/**
 * Chart displaying daily task activity (new, completed, expired)
 * 
 * @param props - Component props
 * @returns React component
 */
export function DailyActivityChart({ tasks }: DailyActivityChartProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const toggleTimeRange = () => {
    setTimeRange(prev => prev === "week" ? "month" : "week");
  };

  const dailyChartData = useMemo(() => {
    const now = new Date();
    const daysToShow = timeRange === "week" ? 7 : 28;
    const data = [];

    // Create an array of the last X days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(now, i);
      
      // Format date based on timeRange
      const dateStr = timeRange === "week" 
        ? format(date, "EEE") 
        : format(date, "dd/MM");
        
      const dayStart = startOfDay(new Date(date));
      const dayEnd = endOfDay(new Date(date));

      // Count tasks completed on this day
      const completedCount = tasks.filter(task => 
        task.completed_at && 
        task.completed_at >= dayStart && 
        task.completed_at <= dayEnd
      ).length;

      // Count tasks expired on this day
      const expiredCount = tasks.filter(task => 
        task.expired_at && 
        task.expired_at >= dayStart && 
        task.expired_at <= dayEnd
      ).length;

      // Count new tasks created on this day
      const newTasksCount = tasks.filter(task => 
        task.created_at >= dayStart && 
        task.created_at <= dayEnd
      ).length;

      data.push({
        date: dateStr,
        completed: completedCount,
        expired: expiredCount,
        new: newTasksCount
      });
    }

    return data;
  }, [tasks, timeRange]);

  const timeRangeButton = (
    <Button 
      variant="outline" 
      onClick={toggleTimeRange}
      className="whitespace-nowrap"
    >
      Show {timeRange === "week" ? "28 Days" : "7 Days"}
    </Button>
  );

  return (
    <TaskStatsCard
      title="Daily Task Activity"
      description={`Tasks created, completed and expired in the last ${timeRange === "week" ? "7" : "28"} days`}
      headerAction={timeRangeButton}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyChartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="new" fill="#3b82f6" name="New" />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="expired" fill="#ef4444" name="Expired" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </TaskStatsCard>
  );
}
