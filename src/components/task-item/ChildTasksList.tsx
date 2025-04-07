
import { format } from 'date-fns';
import { GitBranch, Plus, MoreHorizontal, CheckCircle } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChildTasksListProps {
  task: Task;
  childTasks: Task[];
  onCreateChildTask?: (parentId: string, parentTitle: string) => void;
  defaultOpen?: boolean;
  onCompleteChildTask?: (id: string) => void;
  onEditChildTask?: (task: Task) => void;
  onDeleteChildTask?: (id: string) => void;
}

export function ChildTasksList({ 
  task, 
  childTasks, 
  onCreateChildTask,
  defaultOpen = false,
  onCompleteChildTask,
  onEditChildTask,
  onDeleteChildTask
}: ChildTasksListProps) {
  const [isChildrenOpen, setIsChildrenOpen] = useState(defaultOpen);
  
  // Update open state when defaultOpen changes
  useEffect(() => {
    setIsChildrenOpen(defaultOpen);
  }, [defaultOpen]);
  
  if (!task.child_task_ids?.length || childTasks.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isChildrenOpen}
      onOpenChange={setIsChildrenOpen}
      className="mt-2 border-t pt-2"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-milk-700 hover:text-milk-900 p-0 h-auto"
        >
          <GitBranch className="h-4 w-4" />
          <span>{childTasks.length} {childTasks.length === 1 ? 'subtask' : 'subtasks'}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="pl-4 border-l-2 border-milk-200 space-y-2">
          {childTasks.map(childTask => (
            <div 
              key={childTask.id} 
              className="text-sm flex items-start group relative"
            >
              <div className="w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0" style={{
                backgroundColor: childTask.status === 'closed' 
                  ? '#10b981' // green for completed
                  : '#f59e0b' // amber for in-progress
              }} />
              <div className="break-words flex-1 text-milk-700">
                {childTask.title}
                <div className="text-xs text-milk-500">
                  {childTask.status === 'closed' 
                    ? 'Completed' 
                    : `Due: ${format(childTask.expiry_date, "d MMM")}`}
                </div>
              </div>
              
              {/* Action buttons for child tasks - only visible on hover */}
              {childTask.status === 'open' && onCompleteChildTask && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex items-center gap-1">
                  {/* Complete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-green-500 hover:text-green-700 hover:bg-green-50"
                    onClick={() => onCompleteChildTask(childTask.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  
                  {/* Menu for edit and delete */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEditChildTask && (
                        <DropdownMenuItem onClick={() => onEditChildTask(childTask)}>
                          Edit task
                        </DropdownMenuItem>
                      )}
                      {onDeleteChildTask && (
                        <DropdownMenuItem 
                          onClick={() => onDeleteChildTask(childTask.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete task
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* "Create more" button for parent tasks */}
        {onCreateChildTask && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full"
            onClick={() => onCreateChildTask(task.id, task.title)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add another subtask
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
