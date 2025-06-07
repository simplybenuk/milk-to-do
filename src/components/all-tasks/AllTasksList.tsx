
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
import { useAllTasksView } from '@/hooks/useAllTasksView';
import { exportTasksToMarkdown } from '@/utils/taskExport';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
    openTasks,
    topLevelOpenTasks,
    relevantParents,
    childTasks,
    focusParentId,
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
    // Make sure to fetch the latest tasks after creating a split task
    await fetchTasks();
  };

  const handleExportTasks = () => {
    exportTasksToMarkdown(openTasks);
    toast({
      title: "Tasks exported",
      description: "Your tasks have been exported to a markdown file.",
    });
  };

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      {/* Tag filter and export button container */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <TaskTagFilter />
        </div>
        
        {/* Export button */}
        <div className="flex justify-end">
          <Button
            onClick={handleExportTasks}
            variant="outline"
            size="sm"
            disabled={openTasks.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export ({openTasks.length})
          </Button>
        </div>
      </div>
      
      <TaskList 
        topLevelOpenTasks={topLevelOpenTasks}
        relevantParents={relevantParents}
        childTasks={childTasks}
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
