
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';

export function AllTasksList() {
  const { tasks } = useTaskStore();
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
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
