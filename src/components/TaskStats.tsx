
import { useEffect, useMemo } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function TaskStats() {
  const { tasks, fetchTasks } = useTaskStore();
  const stats = useTaskStore(state => state.getTaskStats());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const chartData = useMemo(() => [
    {
      name: 'Last Week',
      completed: stats.completedLastWeek.length,
      expired: stats.expired.filter(t => t.expired_at && t.expired_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    },
    {
      name: 'Last Month',
      completed: stats.completedLastMonth.length,
      expired: stats.expired.filter(t => t.expired_at && t.expired_at >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    },
  ], [stats]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Overview</CardTitle>
          <CardDescription>Your task completion and expiry statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
