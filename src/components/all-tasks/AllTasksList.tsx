
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { SplitTaskDialog } from '../SplitTaskDialog';
import { EditTaskDialog } from '../EditTaskDialog';
import { UpgradeToProDialog } from '../UpgradeToProDialog';
import { useSubscription } from '@/hooks/useSubscription';
import { TaskTagFilter } from '../TaskTagFilter';
import { TaskList } from './TaskList';
import { useAllTasksView } from './useAllTasksView';

export function AllTasksList() {
  const { deleteTask, completeTask, editTask, fetchTasks } = useTaskStore();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string>("");
  
  // Use our custom hook for task filtering and parent focusing
  const {
    topLevelOpenTasks,
    relevantParents,
    focusParentId,
    setFocusParentId,
    handleViewParent
  } = useAllTasksView();

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

  const handleEditTask = (task: Task) => {
    if (!isPro) {
      setUpgradeFeatureName("Edit Task");
      setShowUpgradeDialog(true);
      return;
    }
    
    setTaskToEdit(task);
    setShowEditDialog(true);
  };

  const handleSplitComplete = async () => {
    console.log("Split completed, refreshing tasks");
    await fetchTasks();
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {/* Tag filter component */}
      <TaskTagFilter />
      
      <TaskList 
        topLevelOpenTasks={topLevelOpenTasks}
        relevantParents={relevantParents}
        focusParentId={focusParentId}
        onComplete={handleComplete}
        onDelete={handleDelete}
        onViewParent={handleViewParent}
        onCreateChildTask={handleCreateChildTask}
        onEdit={handleEditTask}
      />
      
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
        onEdit={editTask}
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
