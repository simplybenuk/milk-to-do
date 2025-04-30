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
import { format, subDays, startOfDay, endOfDay, subMonths, startOfMonth, endOfMonth } from 'date-fns';

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

  // Daily chart data remains the same
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

  // New monthly summary chart data (6 months)
  const monthlySummaryData = useMemo(() => {
    const now = new Date();
    const data = [];

    // Create data for the current month and previous 5 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Format month name (e.g., Jan, Feb, etc.)
      const monthStr = format(monthDate, 'MMM yy'); 
      
      // Count tasks created in this month
      const newTasksCount = tasks.filter(task => 
        task.created_at >= monthStart && 
        task.created_at <= monthEnd
      ).length;
      
      // Count tasks completed in this month
      const completedCount = tasks.filter(task => 
        task.completed_at && 
        task.completed_at >= monthStart && 
        task.completed_at <= monthEnd
      ).length;
      
      // Count tasks expired in this month
      const expiredCount = tasks.filter(task => 
        task.expired_at && 
        task.expired_at >= monthStart && 
        task.expired_at <= monthEnd
      ).length;
      
      data.push({
        month: monthStr,
        new: newTasksCount,
        completed: completedCount,
        expired: expiredCount
      });
    }
    
    return data;
  }, [tasks]);
  
  // Calculate stats for the current month (for summary cards)
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    
    const newTasksCount = tasks.filter(task => 
      task.created_at >= monthStart
    ).length;
    
    const completedCount = tasks.filter(task => 
      task.completed_at && 
      task.completed_at >= monthStart
    ).length;
    
    const expiredCount = tasks.filter(task => 
      task.expired_at && 
      task.expired_at >= monthStart
    ).length;
    
    return {
      new: newTasksCount,
      completed: completedCount,
      expired: expiredCount
    };
  }, [tasks]);

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
          <CardTitle>Monthly Task Summary</CardTitle>
          <CardDescription>Task creation, completion and expiry over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySummaryData}>
                <XAxis dataKey="month" />
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
              <p className="text-sm font-medium text-blue-600">New This Month</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">{currentMonthStats.new}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-medium text-green-600">Completed This Month</p>
              <p className="mt-2 text-3xl font-bold text-green-900">{currentMonthStats.completed}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">Expired This Month</p>
              <p className="mt-2 text-3xl font-bold text-red-900">{currentMonthStats.expired}</p>
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
