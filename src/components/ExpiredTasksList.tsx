
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';

export function ExpiredTasksList() {
  const { tasks } = useTaskStore();
  const expiredTasks = tasks.filter(task => 
    !task.completed && task.expiryDate.getTime() < Date.now()
  );
  
  return (
    <div className="space-y-4">
      {expiredTasks.map((task) => (
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
