
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function AllTasksList() {
  const { tasks, deleteTask, completeTask } = useTaskStore();
  const { toast } = useToast();
  const openTasks = tasks.filter(task => task.status === 'open');
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  
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

  const handleViewParent = (parentId: string) => {
    // Highlight the parent task by scrolling to it
    const parentElement = document.getElementById(`task-${parentId}`);
    if (parentElement) {
      parentElement.scrollIntoView({ behavior: 'smooth' });
      setFocusParentId(parentId);
      // Remove highlight after 2 seconds
      setTimeout(() => setFocusParentId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {openTasks.length === 0 ? (
        <p className="text-center text-milk-500">No tasks available</p>
      ) : (
        openTasks.map((task) => (
          <div 
            key={task.id} 
            id={`task-${task.id}`}
            className={`transition-all duration-500 ${
              focusParentId === task.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
            }`}
          >
            <TaskItem
              task={task}
              onComplete={handleComplete}
              onDelete={handleDelete}
              showCompleteButton={true}
              allTasks={tasks}
              onViewParent={handleViewParent}
            />
          </div>
        ))
      )}
    </div>
  );
}
