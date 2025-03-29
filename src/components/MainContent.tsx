
import { AllTasksList } from '@/components/AllTasksList';
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
  // Create the focus mode container classes
  const containerClasses = cn(
    "flex flex-col items-center justify-center min-h-[400px] relative", 
    inFocusMode && "transition-all duration-500 bg-milk-100/50 rounded-lg shadow-inner p-8 animate-fade-in"
  );

  // Create a darkened overlay when in focus mode
  const focusOverlayClasses = cn(
    "fixed inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10",
    inFocusMode ? "opacity-50" : "opacity-0"
  );

  // Card classes to make it pop in focus mode
  const cardClasses = cn(
    "relative z-20 w-full transition-all duration-500",
    inFocusMode && "scale-105 shadow-xl"
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
        <>
          {/* Darkened overlay for focus mode */}
          <div className={focusOverlayClasses} aria-hidden="true"></div>
          
          <div className={containerClasses}>
            {inFocusMode && onExitFocusMode && (
              <Button 
                onClick={onExitFocusMode}
                variant="outline" 
                size="sm"
                className="self-end mb-4 hover:bg-milk-200 relative z-20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Exit Focus Mode
              </Button>
            )}
            
            <div className={cardClasses}>
              {currentTask ? (
                <CurrentTask
                  task={currentTask}
                  onComplete={onComplete}
                  onSkip={onSkip}
                  onReturnToTop={onReturnToTop}
                  currentIndex={currentIndex}
                  totalTasks={totalTasks}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-milk-500">No tasks available for focus mode.</p>
                  {inFocusMode && (
                    <p className="text-milk-500 mt-4">
                      Add tasks from the All Tasks view to start your focus session.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      );
  }
}
