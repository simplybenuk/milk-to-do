
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { TaskItem } from '@/components/TaskItem';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { Check, SkipForward } from 'lucide-react';

const Index = () => {
  const { tasks, completeTask, getTasksByPriority } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sortedTasks = getTasksByPriority();
  const currentTask = sortedTasks[currentIndex];

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    // Move to next task if available
    if (currentIndex < sortedTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < sortedTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
            Welcome to Milk
          </div>
          <h1 className="text-4xl font-bold text-milk-900 mb-2">
            Your Top Priority
          </h1>
          <p className="text-milk-600">
            Focus on what matters most right now
          </p>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {currentTask ? (
            <div className="w-full max-w-xl animate-fade-in">
              <TaskItem
                key={currentTask.id}
                task={currentTask}
                onComplete={() => {}}
                onDelete={() => {}}
              />
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={() => handleComplete(currentTask.id)}
                  className="w-32 bg-green-500 hover:bg-green-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="w-32"
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-milk-500">No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </div>
      
      <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
        const { addTask } = useTaskStore.getState();
        addTask(title, priority, expiryDate);
      }} />
    </div>
  );
};

export default Index;
