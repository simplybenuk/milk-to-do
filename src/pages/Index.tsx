
import { useState } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { TaskItem } from '@/components/TaskItem';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { Check, SkipForward, ArrowDown, Scissors, List, CheckSquare, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { AllTasksList } from '@/components/AllTasksList';
import { CompletedTasksList } from '@/components/CompletedTasksList';
import { ExpiredTasksList } from '@/components/ExpiredTasksList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { tasks, completeTask, getTasksByPriority, updateTaskPriority } = useTaskStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'all' | 'completed' | 'expired'>('main');
  const sortedTasks = getTasksByPriority();
  const currentTask = sortedTasks[currentIndex];
  const { toast } = useToast();

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    if (currentIndex < sortedTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentTask && (currentTask.priority === 'high' || currentTask.priority === 'medium')) {
      setShowPriorityDialog(true);
    } else {
      moveToNextTask();
    }
  };

  const moveToNextTask = () => {
    if (currentIndex < sortedTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDowngradePriority = () => {
    if (!currentTask) return;
    
    const newPriority = currentTask.priority === 'high' ? 'medium' : 'low';
    updateTaskPriority(currentTask.id, newPriority);
    
    toast({
      title: "Priority Updated",
      description: `Task priority changed to ${newPriority}`,
    });
    
    setShowPriorityDialog(false);
    moveToNextTask();
  };

  const handleSplitTask = () => {
    toast({
      title: "Coming Soon",
      description: "Task splitting feature will be available soon!",
    });
    setShowPriorityDialog(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'all':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">All Tasks</h2>
            <AllTasksList />
          </>
        );
      case 'completed':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">Completed Tasks</h2>
            <CompletedTasksList />
          </>
        );
      case 'expired':
        return (
          <>
            <h2 className="text-2xl font-bold text-milk-900 mb-6">Expired Tasks</h2>
            <ExpiredTasksList />
          </>
        );
      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center relative">
          <div className="absolute right-0 top-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <List className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentView('main')}>
                  <Check className="mr-2 h-4 w-4" />
                  Current Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView('all')}>
                  <List className="mr-2 h-4 w-4" />
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView('completed')}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentView('expired')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Expired
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
            Welcome to Milk
          </div>
          <h1 className="text-4xl font-bold text-milk-900 mb-2">
            {currentView === 'main' ? 'Your Top Priority' : 'Task Overview'}
          </h1>
          <p className="text-milk-600">
            {currentView === 'main' ? 'Focus on what matters most right now' : 'Review your tasks'}
          </p>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          {renderContent()}
        </div>
      </div>
      
      <Dialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>This task seems important</DialogTitle>
            <DialogDescription>
              Would you like to break it down into smaller tasks or lower its priority?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={handleDowngradePriority}
              variant="outline"
              className="w-full"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Lower Priority
            </Button>
            <Button
              onClick={handleSplitTask}
              variant="outline"
              className="w-full"
            >
              <Scissors className="mr-2 h-4 w-4" />
              Split into Smaller Tasks
            </Button>
            <Button
              onClick={() => {
                setShowPriorityDialog(false);
                moveToNextTask();
              }}
              variant="ghost"
              className="w-full"
            >
              Skip Anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <AddTaskDialog onAddTask={(title, priority, expiryDate) => {
        const { addTask } = useTaskStore.getState();
        addTask(title, priority, expiryDate);
      }} />
    </div>
  );
};

export default Index;
