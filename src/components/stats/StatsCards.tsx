
import React from 'react';

interface StatsCardsProps {
  stats: {
    new: number;
    completed: number;
    expired: number;
    activeTasks: number;
    totalCreated: number;
    totalCompleted: number;
    totalExpired: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="space-y-6">
      {/* Monthly Stats */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">This Month</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium text-muted-foreground">Total Active Tasks</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats.activeTasks}</p>
          </div>
        </div>
      </div>

      {/* All Time Stats */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">All Time</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm font-medium text-purple-600">Total Created</p>
            <p className="mt-2 text-3xl font-bold text-purple-900">{stats.totalCreated}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-600">Total Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.totalCompleted}</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-600">Total Expired</p>
            <p className="mt-2 text-3xl font-bold text-orange-900">{stats.totalExpired}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
