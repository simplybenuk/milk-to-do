
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
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

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
      
      // Format date based on timeRange
      // For week view: day of week (Mon, Tue, etc.)
      // For month view: day/month (01/05, etc.)
      const dateStr = timeRange === 'week' 
        ? format(date, 'EEE') // Mon, Tue, Wed, etc.
        : format(date, 'dd/MM'); // 01/05, 02/05, etc.
        
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
        name: 'Last Week',
        completed: stats.completedLastWeek.length,
        expired: lastWeekExpired,
        new: lastWeekNewTasks
      },
      {
        name: 'Last Month',
        completed: stats.completedLastMonth.length,
        expired: lastMonthExpired,
        new: lastMonthNewTasks
      },
    ];
  }, [stats, tasks]);

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
                <YAxis allowDecimals={false} /> {/* Only show whole numbers */}
                <Tooltip />
                <Bar dataKey="new" fill="#3b82f6" name="New" />
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
          <CardDescription>Your task creation, completion and expiry statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryChartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} /> {/* Only show whole numbers */}
                <Tooltip />
                <Bar dataKey="new" fill="#3b82f6" name="New" />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="expired" fill="#ef4444" name="Expired" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-600">New Last Week</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{summaryChartData[0].new}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-medium text-green-600">Completed Last Week</p>
              <p className="mt-2 text-3xl font-bold text-green-900">{stats.completedLastWeek.length}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">Expired Last Week</p>
              <p className="mt-2 text-3xl font-bold text-red-900">{
                stats.expired.filter(t => 
                  t.expired_at && 
                  t.expired_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Total Active Tasks</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{tasks.filter(t => t.status === 'open').length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
