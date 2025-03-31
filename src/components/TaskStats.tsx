
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { ProUpgradeCard } from './stats/ProUpgradeCard';
import { DailyActivityChart } from './stats/DailyActivityChart';
import { TaskSummaryChart } from './stats/TaskSummaryChart';
import { NoTasksPlaceholder } from './stats/NoTasksPlaceholder';

export function TaskStats() {
  const { tasks, fetchTasks, hasProAccess } = useTaskStore();
  const isProUser = hasProAccess();
  
  const stats = useTaskStore.getState().getTaskStats();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // If user doesn't have pro access, show upgrade prompt
  if (!isProUser) {
    return (
      <div className="space-y-8">
        <ProUpgradeCard />
      </div>
    );
  }

  // If no tasks available, show placeholder
  if (!tasks.length) {
    return (
      <div className="space-y-8">
        <NoTasksPlaceholder />
      </div>
    );
  }

  // For pro users with tasks, show the charts
  return (
    <div className="space-y-8">
      <DailyActivityChart tasks={tasks} />
      <TaskSummaryChart tasks={tasks} stats={stats} />
    </div>
  );
}
