
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DailyActivityChart } from './DailyActivityChart';
import { MonthlySummaryChart } from './MonthlySummaryChart';
import { StatsCards } from './StatsCards';

export function TaskStats() {
  const { tasks, fetchTasks } = useTaskStore();
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!tasks.length) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Overview</CardTitle>
            <CardDescription>No tasks available yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">Start adding tasks to see your statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DailyActivityChart tasks={tasks} />
      <MonthlySummaryChart tasks={tasks} />
    </div>
  );
}
