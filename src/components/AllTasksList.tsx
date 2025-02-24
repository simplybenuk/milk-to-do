
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';

export function AllTasksList() {
  const { tasks } = useTaskStore();
  const openTasks = tasks.filter(task => task.status === 'open');
  
  return (
    <div className="space-y-4">
      {openTasks.map((task) => (
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
