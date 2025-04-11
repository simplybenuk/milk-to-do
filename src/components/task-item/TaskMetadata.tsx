
import { Clock } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { TaskAgeIndicator } from './TaskAgeIndicator';
import { SkipCountBadge } from './SkipCountBadge';
import { PriorityScoreBadge } from './PriorityScoreBadge';
import { ParentTaskBadge } from './ParentTaskBadge';
import { ExpiryDateDisplay } from './ExpiryDateDisplay';
import { Task } from '@/types/task';

interface TaskMetadataProps {
  task: Task;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  const isParentTask = task.closed_status === 'parent' && task.child_task_ids?.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex gap-1.5 items-center">
          <PriorityBadge priority={task.priority} />
          
          {/* Priority score badge now has its own section */}
          <PriorityScoreBadge score={task.priority_score} />
        </div>
        
        {/* Second line for status indicators */}
        <div className="flex gap-1.5 items-center">
          {/* Age indicator */}
          {task.status === 'open' && (
            <TaskAgeIndicator 
              createdAt={new Date(task.created_at)} 
              expiryDate={new Date(task.expiry_date)}
            />
          )}
          
          {/* Skip count badge */}
          <SkipCountBadge skipCount={task.skip_count} />
          
          {/* Add a parent task badge */}
          {isParentTask && <ParentTaskBadge />}
        </div>
      </div>
      
      <ExpiryDateDisplay expiryDate={task.expiry_date} />
    </div>
  );
}
