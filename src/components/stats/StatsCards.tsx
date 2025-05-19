
import React, { useMemo } from 'react';
import { Task } from '@/types/task';

export interface StatsCardsProps {
  tasks: Task[];
}

export function StatsCards({ tasks }: StatsCardsProps) {
  // Calculate statistics from tasks
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter tasks created this month
    const newThisMonth = tasks.filter(task => 
      new Date(task.created_at) >= startOfMonth
    ).length;
    
    // Filter tasks completed this month
    const completedThisMonth = tasks.filter(task => 
      task.status === 'closed' && 
      task.closed_status === 'complete' && 
      task.completed_at && 
      new Date(task.completed_at) >= startOfMonth
    ).length;
    
    // Filter tasks expired this month
    const expiredThisMonth = tasks.filter(task => 
      task.status === 'closed' && 
      task.closed_status === 'expired' && 
      task.expired_at && 
      new Date(task.expired_at) >= startOfMonth
    ).length;
    
    // Count active tasks
    const activeTasks = tasks.filter(task => 
      task.status === 'open'
    ).length;
    
    return {
      new: newThisMonth,
      completed: completedThisMonth,
      expired: expiredThisMonth,
      activeTasks
    };
  }, [tasks]);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-600">New This Month</p>
        <p className="mt-2 text-3xl font-bold text-blue-900">{stats.new}</p>
      </div>
      <div className="rounded-lg bg-green-50 p-4">
        <p className="text-sm font-medium text-green-600">Completed This Month</p>
        <p className="mt-2 text-3xl font-bold text-green-900">{stats.completed}</p>
      </div>
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm font-medium text-red-600">Expired This Month</p>
        <p className="mt-2 text-3xl font-bold text-red-900">{stats.expired}</p>
      </div>
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-600">Total Active Tasks</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeTasks}</p>
      </div>
    </div>
  );
}
