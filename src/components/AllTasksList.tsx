
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';

export function AllTasksList() {
  const { tasks, deleteTask } = useTaskStore();
  const { toast } = useToast();
  const openTasks = tasks.filter(task => task.status === 'open');
  
  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "The task has been permanently removed.",
    });
  };

  return (
    <div className="space-y-4">
      {openTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={() => {}}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
