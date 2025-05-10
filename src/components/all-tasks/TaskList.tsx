
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
  topLevelOpenTasks = [], // Provide default empty array
  relevantParents = [], // Provide default empty array
  focusParentId,
  onComplete,
  onDelete,
  onViewParent,
  onCreateChildTask,
  onEdit
}: TaskListProps) {
  // Group the tasks by parent_id
  const groupedTasks: Record<string, Task[]> = {};
  const parentTasks: Task[] = [];
  
  // First, identify standalone tasks and group child tasks
  topLevelOpenTasks.forEach(task => {
    if (!task.parent_id) {
      parentTasks.push(task);
    } else {
      if (!groupedTasks[task.parent_id]) {
        groupedTasks[task.parent_id] = [];
      }
      groupedTasks[task.parent_id].push(task);
    }
  });
  
  // Guard against undefined arrays with safe checks
  const hasRelevantParents = Array.isArray(relevantParents) && relevantParents.length > 0;
  const hasTopLevelTasks = Array.isArray(topLevelOpenTasks) && topLevelOpenTasks.length > 0;
  
  // If no tasks to display, show empty state
  if (!hasTopLevelTasks && !hasRelevantParents) {
    return <p className="text-center text-milk-500">No tasks available</p>;
  }

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
            allTasks={topLevelOpenTasks}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            alwaysShowChildren={true}
            inFocusMode={false}
          />
        </div>
      ))}
      
      {/* Display standalone parent tasks with their children */}
      {parentTasks.map((task) => (
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
            allTasks={topLevelOpenTasks}
            onViewParent={onViewParent}
            onCreateChildTask={onCreateChildTask}
            onEdit={onEdit}
            alwaysShowChildren={true}
            inFocusMode={false}
          />
        </div>
      ))}
      
      {/* Display child tasks that aren't captured in parent views */}
      {topLevelOpenTasks
        .filter(task => task.parent_id && !parentTasks.some(p => p.id === task.parent_id))
        .map((task) => (
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
              allTasks={topLevelOpenTasks}
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
