
import { Task } from '@/types/task';
import { TaskItem } from '../task-item';

interface TaskListProps {
  topLevelOpenTasks: Task[];
  relevantParents: Task[];
  focusParentId: string | null;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onViewParent: (parentId: string) => void;
  onCreateChildTask: (parentId: string, parentTitle: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskList({
  topLevelOpenTasks,
  relevantParents,
  focusParentId,
  onComplete,
  onDelete,
  onViewParent,
  onCreateChildTask,
  onEdit
}: TaskListProps) {
  // If no tasks to display, show empty state
  if (topLevelOpenTasks.length === 0 && relevantParents.length === 0) {
    return <p className="text-center text-milk-500">No tasks available</p>;
  }

  return (
    <div className="w-full space-y-4">
      {/* Display relevant closed parent tasks first */}
      {relevantParents.map((task) => (
        <div 
          key={task.id} 
          id={`task-${task.id}`}
          className={`transition-all duration-500 w-full ${
            focusParentId === task.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
          }`}
        >
          <TaskItem
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            showCompleteButton={false}
            allTasks={[...topLevelOpenTasks, ...relevantParents]}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
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
          className={`transition-all duration-500 w-full ${
            focusParentId === task.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
          }`}
        >
          <TaskItem
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            showCompleteButton={true}
            allTasks={[...topLevelOpenTasks, ...relevantParents]}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            alwaysShowChildren={true}
            inFocusMode={false}
          />
        </div>
      ))}
      
      {/* Add bottom padding to prevent overlap with floating add button on mobile */}
      <div className="h-24 md:h-20" />
    </div>
  );
}
