
import { TaskStatsCard } from "./TaskStatsCard";

export function NoTasksPlaceholder() {
  return (
    <TaskStatsCard
      title="Task Completion Overview"
      description="No tasks available yet"
    >
      <p className="text-center text-gray-500">Start adding tasks to see your statistics</p>
    </TaskStatsCard>
  );
}
