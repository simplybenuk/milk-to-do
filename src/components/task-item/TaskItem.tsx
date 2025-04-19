import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { TextWithLinks } from './TextWithLinks';
import { ChildTasksList } from './ChildTasksList';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { TaskMetadata } from './TaskMetadata';
import { ParentTaskLink } from './ParentTaskLink';
import { TaskActionButtons } from './TaskActionButtons';
import { TaskMenu } from './buttons/TaskMenu';
import { TaskTags } from './TaskTags';
import useTagStore from '@/stores/useTagStore';

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
  alwaysShowChildren?: boolean; // New prop to control child tasks visibility
  inFocusMode?: boolean; // New prop to indicate if in focus mode
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
  onEdit,
  alwaysShowChildren = false,
  inFocusMode = false
}: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { removeTagFromTask } = useTagStore();

  // Get child tasks if this is a parent task
  const childTasks = task.child_task_ids?.length > 0 && allTasks?.length > 0
    ? allTasks.filter(t => task.child_task_ids.includes(t.id))
    : [];

  // Get parent task if this is a child task
  const parentId = task.parent_id;
  const isParentTask = task.closed_status === 'parent' && childTasks.length > 0;
  
  // Find parent task title if this is a child task
  const parentTask = parentId && allTasks?.length > 0
    ? allTasks.find(t => t.id === parentId)
    : undefined;
  const parentTitle = parentTask?.title;

  // Calculate age-based classes
  const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
  const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
  
  const getTaskAgeClass = () => {
    if (daysUntilExpiry < 0) return "task-expired";
    if (ageInDays >= 21) return "task-sour";
    if (ageInDays >= 8) return "task-spoiling"; 
    return "task-fresh";
  };

  const handleComplete = (id: string) => {
    setIsCompleting(true);
    onComplete(id);
  };

  const handleRemoveTag = (tagId: string) => {
    removeTagFromTask(task.id, tagId);
  };

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col rounded-lg border p-5 sm:p-6 shadow-lg transition-all w-full max-w-full",
          "hover:shadow-xl animate-fade-in min-h-[140px] mx-auto",
          isCompleting && "animate-task-complete",
          task.status === 'closed' && "opacity-50",
          // Add age-based color classes when task is open
          task.status === 'open' && getTaskAgeClass(),
          // Add a soft purple background for parent tasks
          isParentTask && "bg-[#F1F0FB]"
        )}
      >
        {/* Position menu at top right */}
        <div className="absolute top-3 right-2">
          <TaskMenu 
            task={task}
            onEdit={onEdit}
            onDelete={() => setShowDeleteDialog(true)}
            showMenuButton={!inFocusMode}
          />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden break-words mb-2">
          {/* Parent task link with added props */}
          <ParentTaskLink 
            parentId={parentId} 
            onViewParent={onViewParent} 
            inFocusMode={inFocusMode}
            parentTitle={parentTitle}
          />
          
          <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4 break-words pr-8">
            <TextWithLinks text={task.title} />
          </h3>
          
          {/* Task tags - moved to a more prominent position */}
          {task.tags && task.tags.length > 0 && (
            <TaskTags 
              taskId={task.id} 
              tags={task.tags} 
              onRemoveTag={!inFocusMode ? handleRemoveTag : undefined}
              className="mb-3"
            />
          )}
          
          {/* Task metadata section */}
          <TaskMetadata task={task} />
        </div>
        
        {/* Action buttons - positioned before child tasks list if parent task */}
        {!isParentTask && (
          <TaskActionButtons
            task={task}
            showCompleteButton={showCompleteButton}
            showDeleteButton={showDeleteButton}
            onComplete={handleComplete}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            isCompleting={isCompleting}
            setShowDeleteDialog={setShowDeleteDialog}
            inFocusMode={inFocusMode}
          />
        )}

        {/* Display child tasks section for parent tasks - always expanded in all tasks view */}
        {isParentTask && (
          <>
            <div className="mb-3">
              <TaskActionButtons
                task={task}
                showCompleteButton={showCompleteButton}
                showDeleteButton={showDeleteButton}
                onComplete={handleComplete}
                onCreateChildTask={onCreateChildTask}
                onEdit={onEdit}
                isCompleting={isCompleting}
                setShowDeleteDialog={setShowDeleteDialog}
                inFocusMode={inFocusMode}
                showSplitButton={false} // Hide the separate split button on parent tasks
              />
            </div>
            <ChildTasksList
              task={task}
              childTasks={childTasks}
              onCreateChildTask={onCreateChildTask}
              defaultOpen={alwaysShowChildren}
              onCompleteChildTask={onComplete}
              onEditChildTask={onEdit}
              onDeleteChildTask={onDelete}
            />
          </>
        )}
      </div>

      <DeleteTaskDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={() => onDelete(task.id)}
      />
    </>
  );
}
