
import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Trash2, CheckCircle, ArrowUp, Scissors, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextWithLinks } from './TextWithLinks';
import { PriorityBadge } from './PriorityBadge';
import { ChildTasksList } from './ChildTasksList';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { Badge } from '@/components/ui/badge';
import { TaskAgeIndicator } from './TaskAgeIndicator';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  showCompleteButton?: boolean;
  showDeleteButton?: boolean;
  onCreateChildTask?: (parentId: string, parentTitle: string) => void;
  allTasks?: Task[]; // To find and display child tasks
  onViewParent?: (parentId: string) => void; // New prop for handling parent view
  onEdit?: (task: Task) => void; // New prop for handling edit
}

export function TaskItem({ 
  task, 
  onComplete, 
  onDelete, 
  showCompleteButton = false,
  showDeleteButton = true, // Default to showing delete button
  onCreateChildTask,
  allTasks = [],
  onViewParent,
  onEdit
}: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get child tasks if this is a parent task
  const childTasks = task.child_task_ids?.length > 0 && allTasks?.length > 0
    ? allTasks.filter(t => task.child_task_ids.includes(t.id))
    : [];

  // Get parent task if this is a child task
  const parentId = task.parent_id;
  const isParentTask = task.closed_status === 'parent' && childTasks.length > 0;

  // Calculate age-based classes
  const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
  const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
  
  const getTaskAgeClass = () => {
    if (daysUntilExpiry < 0) return "task-expired";
    if (ageInDays >= 21) return "task-sour";
    if (ageInDays >= 8) return "task-spoiling"; 
    return "task-fresh";
  };

  const handleComplete = () => {
    setIsCompleting(true);
    // Add slight delay to allow animation to play
    setTimeout(() => {
      onComplete(task.id);
    }, 300);
  };

  const handleSplitTask = () => {
    if (onCreateChildTask) {
      onCreateChildTask(task.id, task.title);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col rounded-lg border p-5 sm:p-6 shadow-lg transition-all w-full max-w-full",
          "hover:shadow-xl animate-fade-in min-h-[140px]",
          isCompleting && "animate-task-complete",
          task.status === 'closed' && "opacity-50",
          // Add age-based color classes when task is open
          task.status === 'open' && getTaskAgeClass(),
          // Add a soft purple background for parent tasks
          isParentTask && "bg-[#F1F0FB]"
        )}
      >
        <div className="flex-1 min-w-0 overflow-hidden break-words mb-16 sm:mb-14">
          {/* Parent task link */}
          {parentId && (
            <div className="mb-2 text-xs flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-6 flex items-center gap-1 hover:text-milk-900"
                onClick={() => onViewParent && onViewParent(parentId)}
              >
                <ArrowUp className="h-3 w-3" />
                <span>View Parent Task</span>
              </Button>
            </div>
          )}
          
          <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4 break-words">
            <TextWithLinks text={task.title} />
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <PriorityBadge priority={task.priority} />
              
              {/* Age indicator */}
              {task.status === 'open' && (
                <TaskAgeIndicator 
                  createdAt={new Date(task.created_at)} 
                  expiryDate={new Date(task.expiry_date)}
                />
              )}
              
              {/* Skip count badge */}
              {task.skip_count > 0 && (
                <Badge variant="outline" className="text-xs">
                  Skipped: {task.skip_count}
                </Badge>
              )}
              
              {/* Priority score badge */}
              <Badge variant="secondary" className="text-xs">
                Score: {Math.round(task.priority_score)}
              </Badge>
              
              {/* Add a parent task badge */}
              {isParentTask && (
                <Badge variant="outline" className="text-xs bg-[#F5F4FF] text-teal-700 border-teal-200">
                  Parent
                </Badge>
              )}
            </div>
            
            <span className="text-xs sm:text-sm">
              Expires: {format(task.expiry_date, "d MMM HH:mm")}
            </span>

            {/* Display child tasks section for parent tasks */}
            {isParentTask && (
              <ChildTasksList
                task={task}
                childTasks={childTasks}
                onCreateChildTask={onCreateChildTask}
              />
            )}
          </div>
        </div>
        
        <div className="absolute bottom-5 right-5 flex gap-3">
          {showCompleteButton && (
            <>
              {onEdit && task.status === 'open' && (
                <Button
                  variant="outline"
                  size="icon"
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 shrink-0 w-10 h-10 rounded-full"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="text-green-500 hover:text-green-700 hover:bg-green-50 shrink-0 w-10 h-10 rounded-full"
                onClick={handleComplete}
                title="Complete task"
              >
                <CheckCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-teal-500 hover:text-teal-700 hover:bg-teal-50 shrink-0 w-10 h-10 rounded-full"
                onClick={handleSplitTask}
                title="Split into subtasks"
              >
                <Scissors className="h-5 w-5" />
              </Button>
            </>
          )}
          {showDeleteButton && (
            <Button
              variant="outline"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 w-10 h-10 rounded-full"
              onClick={() => setShowDeleteDialog(true)}
              title="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={() => onDelete(task.id)}
      />
    </>
  );
}
