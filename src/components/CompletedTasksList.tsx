
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';

export function CompletedTasksList() {
  const { tasks } = useTaskStore();
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <div className="space-y-4">
      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
