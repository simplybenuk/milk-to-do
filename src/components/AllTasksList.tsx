
import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';

export function AllTasksList() {
  const { tasks, deleteTask, completeTask } = useTaskStore();
  const { toast } = useToast();
  const openTasks = tasks.filter(task => task.status === 'open');
  
  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "The task has been permanently removed.",
    });
  };

  const handleComplete = async (taskId: string) => {
    await completeTask(taskId);
    toast({
      title: "Task completed",
      description: "Great job! The task has been marked as complete.",
    });
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {openTasks.length === 0 ? (
        <p className="text-center text-milk-500">No tasks available</p>
      ) : (
        openTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onDelete={handleDelete}
            showCompleteButton={true}
          />
        ))
      )}
    </div>
  );
}
