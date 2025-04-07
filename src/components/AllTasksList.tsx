
import { TaskItem } from './task-item';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { SplitTaskDialog } from './SplitTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { UpgradeToProDialog } from './UpgradeToProDialog';
import { useSubscription } from '@/hooks/useSubscription';
import { ClosedStatusReason, Task, Priority } from '@/types/task';

export function AllTasksList() {
  const { tasks, deleteTask, completeTask, editTask, fetchTasks } = useTaskStore();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const [focusParentId, setFocusParentId] = useState<string | null>(null);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string>("");
  
  // Get all open tasks, excluding expired ones
  const openTasks = tasks.filter(task => 
    task.status === 'open' && 
    // Ensure expiry_date is valid and greater than or equal to the current date
    new Date(task.expiry_date) >= new Date()
  );
  
  // Get relevant parents for the filtered open tasks
  const relevantParents = tasks.filter(task => 
    task.status === 'closed' && 
    task.closed_status === 'parent' &&
    openTasks.some(childTask => childTask.parent_id === task.id)
  );
  
  // Filter out child tasks from the open tasks list 
  // so we don't show them as individual cards
  const topLevelOpenTasks = openTasks.filter(task => !task.parent_id);
  
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
    if (!isPro) {
      setUpgradeFeatureName("Split Task");
      setShowUpgradeDialog(true);
      return;
    }
    
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
    if (!isPro) {
      setUpgradeFeatureName("Edit Task");
      setShowUpgradeDialog(true);
      return;
    }
    
    setTaskToEdit(task);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (id: string, title: string, priority: Priority) => {
    await editTask(id, title, priority);
  };

  const handleSplitComplete = async () => {
    console.log("Split completed, refreshing tasks");
    // Refresh the task list
    await fetchTasks();
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {topLevelOpenTasks.length === 0 && relevantParents.length === 0 ? (
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
                onEdit={handleEditTask}
                alwaysShowChildren={true}
                inFocusMode={false}
              />
            </div>
          ))}
          
          {/* Display open top-level tasks (excluding child tasks) */}
          {topLevelOpenTasks.map((task) => (
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
                alwaysShowChildren={true}
                inFocusMode={false}
              />
            </div>
          ))}
          
          {/* Add bottom padding to prevent overlap with floating add button on mobile */}
          <div className="h-24 md:h-20" />
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
      
      {/* Upgrade to Pro Dialog */}
      <UpgradeToProDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        featureName={upgradeFeatureName}
      />
    </div>
  );
}
