
import { AllTasksList } from '@/components/all-tasks';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { TaskStats } from '@/components/stats';
import { CurrentTask } from '@/components/CurrentTask';
import { AppView } from '@/hooks/useAppView';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusTagInfo } from '@/components/focus/FocusTagInfo';

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
  selectedTagIds?: string[];
  noTasksAvailable?: boolean;
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
  onExitFocusMode,
  selectedTagIds,
  noTasksAvailable = false
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
        <div className="min-h-[400px] flex flex-col items-center justify-center w-full">
          {inFocusMode && <FocusTagInfo selectedTagIds={selectedTagIds} />}
          
          <div className={cardClasses}>
            {currentTask && !noTasksAvailable ? (
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
              <div className="text-center py-12 bg-card rounded-lg shadow-lg">
                {noTasksAvailable ? (
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-milk-500 font-medium">All tasks have been processed!</p>
                    <p className="text-milk-500 text-sm">You've completed or skipped all tasks for this session.</p>
                    {totalTasks > 0 && (
                      <Button 
                        onClick={onReturnToTop}
                        variant="outline" 
                        size="sm"
                        className="mt-4"
                      >
                        Return to First Task
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-milk-500">No tasks available for focus mode.</p>
                )}
                
                {inFocusMode && (
                  <>
                    <p className="text-milk-500 mt-4">
                      {selectedTagIds && selectedTagIds.length > 0 && !noTasksAvailable
                        ? 'No tasks match your selected tags. Try selecting different tags.' 
                        : !noTasksAvailable && 'Add tasks from the All Tasks view to start your focus session.'}
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
