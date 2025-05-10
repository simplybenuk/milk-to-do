
import { Task } from '@/types/task';
import { TaskItem } from '../task-item';

interface TaskListProps {
  topLevelOpenTasks: Task[];
  relevantParents: Task[];
  childTasks: Task[]; // Add childTasks as a prop
  focusParentId: string | null;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onViewParent: (parentId: string) => void;
  onCreateChildTask: (parentId: string, parentTitle: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskList({
  topLevelOpenTasks = [],
  relevantParents = [],
  childTasks = [], // Provide default empty array
  focusParentId,
  onComplete,
  onDelete,
  onViewParent,
  onCreateChildTask,
  onEdit
}: TaskListProps) {
  // Group child tasks by parent_id for easier rendering
  const groupedChildTasks: Record<string, Task[]> = {};
  
  childTasks.forEach(task => {
    if (task.parent_id) {
      if (!groupedChildTasks[task.parent_id]) {
        groupedChildTasks[task.parent_id] = [];
      }
      groupedChildTasks[task.parent_id].push(task);
    }
  });
  
  // Guard against undefined arrays with safe checks
  const hasRelevantParents = Array.isArray(relevantParents) && relevantParents.length > 0;
  const hasTopLevelTasks = Array.isArray(topLevelOpenTasks) && topLevelOpenTasks.length > 0;
  const hasChildTasks = Array.isArray(childTasks) && childTasks.length > 0;
  
  // If no tasks to display, show empty state
  if (!hasTopLevelTasks && !hasRelevantParents && !hasChildTasks) {
    return <p className="text-center text-milk-500">No tasks available</p>;
  }

  // Helper function to check if a task is being displayed as a child under its parent
  const isDisplayedUnderParent = (task: Task) => {
    if (!task.parent_id) return false;
    
    // Check if the parent is in relevantParents or topLevelOpenTasks
    const parentInRelevant = relevantParents.some(p => p.id === task.parent_id);
    const parentInTopLevel = topLevelOpenTasks.some(p => p.id === task.parent_id);
    
    return parentInRelevant || parentInTopLevel;
  };

  // Find orphaned child tasks (those whose parents are not in the current view)
  const orphanedChildTasks = childTasks.filter(task => !isDisplayedUnderParent(task));

  return (
    <div className="w-full space-y-4">
      {/* Display relevant closed parent tasks first */}
      {hasRelevantParents && relevantParents.map((task) => (
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
            allTasks={[...topLevelOpenTasks, ...childTasks]}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            alwaysShowChildren={true}
            inFocusMode={false}
          />
        </div>
      ))}
      
      {/* Display standalone parent tasks with their children */}
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
            allTasks={[...topLevelOpenTasks, ...childTasks]}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            alwaysShowChildren={true}
            inFocusMode={false}
          />
        </div>
      ))}
      
      {/* Display orphaned child tasks (child tasks whose parents are not displayed) */}
      {orphanedChildTasks.map((task) => (
        <div 
          key={task.id} 
          id={`task-${task.id}`}
          className="transition-all duration-500 w-full ml-4 border-l-2 border-indigo-100 pl-3"
        >
          <TaskItem
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            showCompleteButton={true}
            allTasks={[...topLevelOpenTasks, ...childTasks]}
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
