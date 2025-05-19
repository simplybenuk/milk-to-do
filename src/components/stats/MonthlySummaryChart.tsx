
import React, { useMemo } from 'react';
import { Task } from '@/types/task';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StatsCards } from './StatsCards';

interface MonthlySummaryChartProps {
  tasks: Task[];
}

export function MonthlySummaryChart({ tasks }: MonthlySummaryChartProps) {
  const chartData = useMemo(() => {
    // Get dates for the last 3 months
    const today = new Date();
    const months = [];
    
    for (let i = 2; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        year: monthDate.getFullYear(),
        startDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
        endDate: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
      });
    }
    
    // Calculate stats for each month
    return months.map(({ month, year, startDate, endDate }) => {
      // Tasks created in this month
      const created = tasks.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate >= startDate && taskDate <= endDate;
      }).length;
      
      // Tasks completed in this month
      const completed = tasks.filter(task => {
        if (!task.completed_at || task.closed_status !== 'complete') return false;
        const completedDate = new Date(task.completed_at);
        return completedDate >= startDate && completedDate <= endDate;
      }).length;
      
      // Tasks expired in this month
      const expired = tasks.filter(task => {
        if (!task.expired_at || task.closed_status !== 'expired') return false;
        const expiredDate = new Date(task.expired_at);
        return expiredDate >= startDate && expiredDate <= endDate;
      }).length;
      
      return {
        name: `${month} ${year}`,
        Created: created,
        Completed: completed,
        Expired: expired
      };
    });
  }, [tasks]);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 overflow-x-auto">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Created" fill="#8884d8" />
            <Bar dataKey="Completed" fill="#82ca9d" />
            <Bar dataKey="Expired" fill="#ff8042" />
          </BarChart>
        </div>
        
        {/* Stats cards now correctly pass tasks as a prop */}
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
          <StatsCards tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
