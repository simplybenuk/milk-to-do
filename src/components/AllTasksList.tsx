
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { SplitTaskDialog } from './SplitTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';

export function AllTasksList() {
  const { tasks, deleteTask, completeTask, editTask } = useTaskStore();
  const { toast } = useToast();
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  // Get all open tasks and their closed parents if they exist
  const openTasks = tasks.filter(task => task.status === 'open');
  const relevantParents = tasks.filter(task => 
    task.status === 'closed' && 
    task.closed_status === 'parent' &&
    openTasks.some(childTask => childTask.parent_id === task.id)
  );
  
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

  const handleCreateChildTask = (parentId: string, parentTitle: string) => {
    setSelectedTaskId(parentId);
    setSelectedTaskTitle(parentTitle);
    setShowSplitDialog(true);
  };

  const handleViewParent = (parentId: string) => {
    const parentTask = [...openTasks, ...relevantParents].find(t => t.id === parentId);
    if (parentTask) {
      const parentElement = document.getElementById(`task-${parentId}`);
      if (parentElement) {
        parentElement.scrollIntoView({ behavior: 'smooth' });
        setFocusParentId(parentId);
        // Remove highlight after 2 seconds
        setTimeout(() => setFocusParentId(null), 2000);
      }
    } else {
      toast({
        title: "Parent task not found",
        description: "The parent task might have been deleted.",
        variant: "destructive"
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (id: string, title: string, priority: Priority) => {
    await editTask(id, title, priority);
  };

  const handleSplitComplete = () => {
    // Refresh the task list
    const { fetchTasks } = useTaskStore.getState();
    fetchTasks();
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {openTasks.length === 0 ? (
        <p className="text-center text-milk-500">No tasks available</p>
      ) : (
        <>
          {/* Display relevant closed parent tasks first */}
          {relevantParents.map((task) => (
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
                showCompleteButton={false}
                allTasks={tasks}
                onViewParent={handleViewParent}
                onCreateChildTask={handleCreateChildTask}
              />
            </div>
          ))}
          
          {/* Display open tasks */}
          {openTasks.map((task) => (
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
                onCreateChildTask={handleCreateChildTask}
                onEdit={handleEditTask}
              />
            </div>
          ))}
        </>
      )}
      
      {/* Split Task Dialog */}
      <SplitTaskDialog
        open={showSplitDialog}
        onOpenChange={setShowSplitDialog}
        parentTaskId={selectedTaskId}
        parentTaskTitle={selectedTaskTitle}
        onSplitComplete={handleSplitComplete}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={taskToEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onEdit={handleSaveEdit}
      />
    </div>
  );
}
