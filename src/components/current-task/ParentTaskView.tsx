
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { TaskItem } from '../task-item';

interface ParentTaskViewProps {
  parentTask: Task;
  tasks: Task[];
  onReturn: () => void;
}

export function ParentTaskView({ parentTask, tasks, onReturn }: ParentTaskViewProps) {
  return (
    <div className="w-full max-w-xl animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-milk-600">Viewing parent task</span>
        <Button
          onClick={onReturn}
          variant="outline"
          size="sm"
        >
          Return to current task
        </Button>
      </div>
      
      <TaskItem
        key={parentTask.id}
        task={parentTask}
        onComplete={() => {}}
        onDelete={() => {}}
        allTasks={tasks}
        showDeleteButton={false}
      />
    </div>
  );
}
