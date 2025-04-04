
import { format } from 'date-fns';
import { PriorityBadge } from './PriorityBadge';
import { TaskAgeIndicator } from './TaskAgeIndicator';
import { SkipCountBadge } from './SkipCountBadge';
import { PriorityScoreBadge } from './PriorityScoreBadge';
import { ParentTaskBadge } from './ParentTaskBadge';
import { Task } from '@/types/task';

interface TaskMetadataProps {
  task: Task;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  const isParentTask = task.closed_status === 'parent' && task.child_task_ids?.length > 0;

  return (
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
        <SkipCountBadge skipCount={task.skip_count} />
        
        {/* Priority score badge */}
        <PriorityScoreBadge score={task.priority_score} />
        
        {/* Add a parent task badge */}
        {isParentTask && <ParentTaskBadge />}
      </div>
      
      <span className="text-xs sm:text-sm">
        Expires: {format(task.expiry_date, "d MMM HH:mm")}
      </span>
    </div>
  );
}
