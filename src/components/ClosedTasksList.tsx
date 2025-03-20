
import { useState } from 'react';
import { TaskItem } from './task-item';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { ClosedStatusReason } from '@/types/task';
import { SplitTaskDialog } from './SplitTaskDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckSquare, 
  Clock, 
  SplitSquareHorizontal 
} from 'lucide-react';

type FilterType = "all" | ClosedStatusReason;

export function ClosedTasksList() {
  const { tasks, deleteTask } = useTaskStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState<{ id: string, title: string } | null>(null);
  
  const closedTasks = tasks.filter(task => {
    if (task.status !== 'closed') return false;
    
    if (filter === 'all') return true;
    return task.closed_status === filter;
  });
  
  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "The task has been permanently removed.",
    });
  };

  const handleCreateChildTask = (parentId: string, parentTitle: string) => {
    console.log("Creating child for parent:", parentId, parentTitle);
    setSelectedParentTask({ id: parentId, title: parentTitle });
    setShowSplitDialog(true);
  };

  const handleSplitComplete = () => {
    setShowSplitDialog(false);
    setSelectedParentTask(null);
    toast({
      title: "Subtask added",
      description: "A new subtask has been created successfully.",
    });
  };

  const getEmptyStateMessage = () => {
    switch (filter) {
      case 'complete':
        return "You haven't completed any tasks yet.";
      case 'expired':
        return "You don't have any expired tasks.";
      case 'parent':
        return "You haven't split any tasks into smaller ones yet.";
      default:
        return "You don't have any closed tasks yet.";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter closed tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All closed tasks</SelectItem>
            <SelectItem value="complete">
              <div className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" />
                Completed
              </div>
            </SelectItem>
            <SelectItem value="expired">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Expired
              </div>
            </SelectItem>
            <SelectItem value="parent">
              <div className="flex items-center">
                <SplitSquareHorizontal className="mr-2 h-4 w-4" />
                Split
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {closedTasks.length > 0 ? (
        <div className="space-y-4">
          {closedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={() => {}}
              onDelete={handleDelete}
              allTasks={tasks}
              onCreateChildTask={task.closed_status === 'parent' ? handleCreateChildTask : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-milk-500">{getEmptyStateMessage()}</p>
        </div>
      )}

      {selectedParentTask && (
        <SplitTaskDialog
          open={showSplitDialog}
          onOpenChange={setShowSplitDialog}
          parentTaskId={selectedParentTask.id}
          parentTaskTitle={selectedParentTask.title}
          onSplitComplete={handleSplitComplete}
        />
      )}
    </div>
  );
}
