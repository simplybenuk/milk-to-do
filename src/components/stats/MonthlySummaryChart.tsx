
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from '@/types/task';
import { StatsCards } from './StatsCards';

interface MonthlySummaryChartProps {
  tasks: Task[];
}

export function MonthlySummaryChart({ tasks }: MonthlySummaryChartProps) {
  // Monthly summary chart data (6 months)
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
      expired: expiredCount,
      activeTasks: tasks.filter(t => t.status === 'open').length
    };
  }, [tasks]);

  return (
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
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="new" fill="#3b82f6" name="New" />
              <Bar dataKey="completed" fill="#22c55e" name="Completed" />
              <Bar dataKey="expired" fill="#ef4444" name="Expired" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <StatsCards stats={currentMonthStats} />
      </CardContent>
    </Card>
  );
}
