
import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, isValid } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from '@/types/task';

interface MonthlySummaryChartProps {
  tasks: Task[];
}

export function MonthlySummaryChart({ tasks }: MonthlySummaryChartProps) {
  // Monthly summary chart data (6 months) with enhanced validation
  const monthlySummaryData = useMemo(() => {
    if (!Array.isArray(tasks)) {
      console.warn('Invalid tasks data provided to MonthlySummaryChart');
      return [];
    }

    const now = new Date();
    const data = [];

    // Create data for the current month and previous 5 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      // Format month name (e.g., Jan, Feb, etc.)
      const monthStr = format(monthDate, 'MMM yy'); 
      
      // Count tasks created in this month with validation
      const newTasksCount = tasks.filter(task => {
        if (!task?.created_at) return false;
        const createdAt = new Date(task.created_at);
        return isValid(createdAt) && createdAt >= monthStart && createdAt <= monthEnd;
      }).length;
      
      // Count tasks completed in this month with validation
      const completedCount = tasks.filter(task => {
        if (!task?.completed_at) return false;
        const completedAt = new Date(task.completed_at);
        return isValid(completedAt) && completedAt >= monthStart && completedAt <= monthEnd;
      }).length;
      
      // Count tasks expired in this month with validation
      const expiredCount = tasks.filter(task => {
        if (!task?.expired_at) return false;
        const expiredAt = new Date(task.expired_at);
        return isValid(expiredAt) && expiredAt >= monthStart && expiredAt <= monthEnd;
      }).length;
      
      data.push({
        month: monthStr,
        new: Math.max(0, newTasksCount), // Ensure non-negative
        completed: Math.max(0, completedCount),
        expired: Math.max(0, expiredCount)
      });
    }
    
    return data;
  }, [tasks]);

  // Custom tooltip to prevent XSS
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{String(label).replace(/[<>]/g, '')}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${Math.max(0, Number(entry.value) || 0)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => String(value).replace(/[<>]/g, '')}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
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
