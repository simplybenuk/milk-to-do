
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PaperclipIcon, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { PriorityBadge } from './PriorityBadge';
import { TaskAgeIndicator } from './TaskAgeIndicator';
import { CompleteButton } from './buttons/CompleteButton';
import { TaskMenu } from './buttons/TaskMenu';

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
  childTasks = [], // Add default empty array
  onCreateChildTask,
  defaultOpen = false,
  onCompleteChildTask,
  onEditChildTask,
  onDeleteChildTask
}: ChildTasksListProps) {
  // Guard against undefined childTasks
  const safeChildTasks = Array.isArray(childTasks) ? childTasks : [];
  
  const openTasks = safeChildTasks.filter(t => t.status === 'open');
  const closedTasks = safeChildTasks.filter(t => t.status === 'closed');
  const [isCompleting, setIsCompleting] = useState<Record<string, boolean>>({});

  const handleCompleteChildTask = (id: string) => {
    setIsCompleting(prev => ({ ...prev, [id]: true }));
    
    setTimeout(() => {
      if (onCompleteChildTask) {
        onCompleteChildTask(id);
      }
    }, 300);
  };

  const handleCreateChildTask = () => {
    if (onCreateChildTask) {
      onCreateChildTask(task.id, task.title);
    }
  };

  const hasChildTasks = openTasks.length > 0 || closedTasks.length > 0;

  if (!hasChildTasks && !onCreateChildTask) {
    return null;
  }

  const defaultAccordionValue = defaultOpen ? ['child-tasks'] : [];

  return (
    <div className="mt-2 border-t border-gray-200 pt-3">
      <Accordion type="single" collapsible defaultValue={defaultAccordionValue.length > 0 ? defaultAccordionValue[0] : undefined}>
        <AccordionItem value="child-tasks" className="border-none">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="py-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <div className="flex items-center gap-2">
                <PaperclipIcon className="h-4 w-4" />
                <span>
                  {openTasks.length} subtask{openTasks.length !== 1 ? 's' : ''}
                  {closedTasks.length > 0 && ` (${closedTasks.length} completed)`}
                </span>
              </div>
            </AccordionTrigger>
          </div>
          
          <AccordionContent className="pt-3">
            <div className="space-y-3">
              {openTasks.map((childTask) => (
                <div 
                  key={childTask.id} 
                  className={`flex items-center justify-between p-3 bg-card rounded-md border shadow-sm ${
                    isCompleting[childTask.id] ? 'animate-task-complete' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge priority={childTask.priority} size="sm" />
                      <TaskAgeIndicator 
                        createdAt={childTask.created_at} 
                        expiryDate={childTask.expiry_date} 
                      />
                    </div>
                    <h4 className="text-sm font-medium truncate">{childTask.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {onCompleteChildTask && (
                      <CompleteButton onComplete={() => handleCompleteChildTask(childTask.id)} />
                    )}
                    <TaskMenu 
                      task={childTask}
                      onEdit={onEditChildTask ? () => onEditChildTask(childTask) : undefined}
                      onDelete={onDeleteChildTask ? () => onDeleteChildTask(childTask.id) : undefined}
                    />
                  </div>
                </div>
              ))}
              
              {onCreateChildTask && (
                <Button 
                  onClick={handleCreateChildTask} 
                  variant="outline" 
                  className="w-full text-teal-600 hover:text-teal-700 border-dashed border-teal-300 hover:border-teal-400 hover:bg-teal-50"
                >
                  <Scissors className="h-4 w-4 mr-2" />
                  Add another subtask
                </Button>
              )}
              
              {closedTasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h5 className="text-xs font-medium uppercase text-muted-foreground">Completed</h5>
                  {closedTasks.map((childTask) => (
                    <div key={childTask.id} className="flex items-center p-2 bg-muted rounded-md opacity-70">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-through truncate">{childTask.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
