
import { useCallback, useEffect, useMemo, useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { format, subDays } from 'date-fns';

export function TaskStats() {
  const { tasks, fetchTasks } = useTaskStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  
  const stats = useMemo(() => useTaskStore.getState().getTaskStats(), [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTimeRange = () => {
    setTimeRange(prev => prev === 'week' ? 'month' : 'week');
  };

  const dailyChartData = useMemo(() => {
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 28;
    const data = [];

    // Create an array of the last X days
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'MMM dd');
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // Count tasks completed on this day
      const completedCount = tasks.filter(task => 
        task.completed_at && 
        task.completed_at >= startOfDay && 
        task.completed_at <= endOfDay
      ).length;

      // Count tasks expired on this day
      const expiredCount = tasks.filter(task => 
        task.expired_at && 
        task.expired_at >= startOfDay && 
        task.expired_at <= endOfDay
      ).length;

      data.push({
        date: dateStr,
        completed: completedCount,
        expired: expiredCount
      });
    }

    return data;
  }, [tasks, timeRange]);

  const summaryChartData = useMemo(() => {
    const lastWeekExpired = stats.expired.filter(t => 
      t.expired_at && 
      t.expired_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const lastMonthExpired = stats.expired.filter(t => 
      t.expired_at && 
      t.expired_at >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    return [
      {
        name: 'Last Week',
        completed: stats.completedLastWeek.length,
        expired: lastWeekExpired,
      },
      {
        name: 'Last Month',
        completed: stats.completedLastMonth.length,
        expired: lastMonthExpired,
      },
    ];
  }, [stats]);

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Daily Task Activity</CardTitle>
            <CardDescription>
              Tasks completed and expired in the last {timeRange === 'week' ? '7' : '28'} days
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
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="expired" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Summary</CardTitle>
          <CardDescription>Your task completion and expiry statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="expired" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-medium text-green-600">Completed Last Week</p>
              <p className="mt-2 text-3xl font-bold text-green-900">{stats.completedLastWeek.length}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-600">Completed Last Month</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{stats.completedLastMonth.length}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">Total Expired</p>
              <p className="mt-2 text-3xl font-bold text-red-900">{stats.expired.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
