
import React from 'react';

interface StatsCardsProps {
  stats: {
    new: number;
    completed: number;
    expired: number;
    activeTasks: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
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
