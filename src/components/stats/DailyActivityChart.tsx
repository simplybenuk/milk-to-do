
import { useState, useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from '@/types/task';

interface DailyActivityChartProps {
  tasks: Task[];
}

export function DailyActivityChart({ tasks }: DailyActivityChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const toggleTimeRange = () => {
    setTimeRange(prev => prev === 'week' ? 'month' : 'week');
  };

  // Daily chart data
  const dailyChartData = useMemo(() => {
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 28;
    const data = [];

    // Create an array of the last X days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(now, i);
      
      // Format date based on timeRange
      const dateStr = timeRange === 'week' 
        ? format(date, 'EEE') // Mon, Tue, Wed, etc.
        : format(date, 'dd/MM'); // 01/05, etc.
        
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Daily Task Activity</CardTitle>
          <CardDescription>
            Tasks created, completed and expired in the last {timeRange === 'week' ? '7' : '28'} days
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={toggleTimeRange}
          className="whitespace-nowrap"
        >
          Show {timeRange === 'week' ? '28 Days' : '7 Days'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyChartData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="new" fill="#3b82f6" name="New" />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              <Bar dataKey="expired" fill="#ef4444" name="Expired" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
