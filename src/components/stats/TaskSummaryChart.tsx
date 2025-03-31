
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Task } from "@/types/task";
import { TaskStats as TaskStatsType } from "@/stores/types/taskStore.types";
import { TaskStatsCard } from "./TaskStatsCard";
import { StatsMetricCards } from "./StatsMetricCards";

interface TaskSummaryChartProps {
  tasks: Task[];
  stats: TaskStatsType;
}

export function TaskSummaryChart({ tasks, stats }: TaskSummaryChartProps) {
  const summaryChartData = useMemo(() => {
    const lastWeekDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const lastMonthDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const lastWeekExpired = stats.expired.filter(t => 
      t.expired_at && 
      t.expired_at >= lastWeekDate
    ).length;
    
    const lastMonthExpired = stats.expired.filter(t => 
      t.expired_at && 
      t.expired_at >= lastMonthDate
    ).length;

    // Count new tasks created in the last week and month
    const lastWeekNewTasks = tasks.filter(t => 
      t.created_at >= lastWeekDate
    ).length;

    const lastMonthNewTasks = tasks.filter(t => 
      t.created_at >= lastMonthDate
    ).length;

    return [
      {
        name: "Last Week",
        completed: stats.completedLastWeek.length,
        expired: lastWeekExpired,
        new: lastWeekNewTasks
      },
      {
        name: "Last Month",
        completed: stats.completedLastMonth.length,
        expired: lastMonthExpired,
        new: lastMonthNewTasks
      },
    ];
  }, [stats, tasks]);

  // Calculate metrics for summary cards
  const weeklyStats = {
    newTasksCount: summaryChartData[0].new,
    completedCount: stats.completedLastWeek.length,
    expiredCount: stats.expired.filter(t => 
      t.expired_at && 
      t.expired_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    activeTasksCount: tasks.filter(t => t.status === "open").length
  };

  return (
    <TaskStatsCard
      title="Task Completion Summary"
      description="Your task creation, completion and expiry statistics"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summaryChartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="new" fill="#3b82f6" name="New" />
            <Bar dataKey="completed" fill="#22c55e" name="Completed" />
            <Bar dataKey="expired" fill="#ef4444" name="Expired" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <StatsMetricCards stats={weeklyStats} />
    </TaskStatsCard>
  );
}
