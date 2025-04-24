
import { AllTasksList } from '@/components/all-tasks';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { TaskStats } from '@/components/TaskStats';
import { CurrentTask } from '@/components/CurrentTask';
import { AppView } from '@/hooks/useAppView';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  currentView: AppView;
  currentTask?: any;
  onComplete: (taskId: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  currentIndex: number;
  totalTasks: number;
  inFocusMode: boolean;
  onExitFocusMode?: () => void;
}

export function MainContent({
  currentView,
  currentTask,
  onComplete,
  onSkip,
  onReturnToTop,
  currentIndex,
  totalTasks,
  inFocusMode,
  onExitFocusMode
}: MainContentProps) {
  // Card classes to make it pop in focus mode
  const cardClasses = cn(
    "relative w-full max-w-xl mx-auto transition-all duration-500", // Added max-w-xl and mx-auto
    inFocusMode && "scale-105 shadow-2xl"
  );

  switch (currentView) {
    case 'all':
      return (
        <>
          <h2 className="text-2xl font-bold text-milk-900 mb-6">All Tasks</h2>
          <AllTasksList />
        </>
      );
    case 'closed':
      return (
        <>
          <h2 className="text-2xl font-bold text-milk-900 mb-6">Closed Tasks</h2>
          <ClosedTasksList />
        </>
      );
    case 'stats':
      return <TaskStats />;
    default:
      return (
        <div className="min-h-[400px] flex items-center justify-center w-full">
          <div className={cardClasses}>
            {currentTask ? (
              <CurrentTask
                task={currentTask}
                onComplete={onComplete}
                onSkip={onSkip}
                onReturnToTop={onReturnToTop}
                currentIndex={currentIndex}
                totalTasks={totalTasks}
                inFocusMode={inFocusMode}
                onExitFocusMode={onExitFocusMode}
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-milk-500">No tasks available for focus mode.</p>
                {inFocusMode && (
                  <>
                    <p className="text-milk-500 mt-4">
                      Add tasks from the All Tasks view to start your focus session.
                    </p>
                    {onExitFocusMode && (
                      <Button 
                        onClick={onExitFocusMode}
                        variant="outline" 
                        size="sm"
                        className="mt-6 border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Exit Focus Mode
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
  }
}
