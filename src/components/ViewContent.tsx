
import { AppView } from '@/hooks/useAppView';
import { AllTasksList } from '@/components/all-tasks';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { MainContent } from '@/components/MainContent';
import { TaskStats } from '@/components/stats';

interface ViewContentProps {
  currentView: AppView;
  inFocusMode: boolean;
}

export function ViewContent({ currentView, inFocusMode }: ViewContentProps) {
  // If in focus mode, don't render anything - let FocusModeContainer handle it
  if (inFocusMode) {
    return null;
  }
  
  // If not in focus mode, render the appropriate view directly
  return (
    <div className="w-full">
      {currentView === 'main' && (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <p className="text-milk-500 text-center mb-4">Switch to Focus Mode to see your prioritized tasks.</p>
        </div>
      )}
      {currentView === 'all' && <AllTasksList />}
      {currentView === 'closed' && <ClosedTasksList />}
      {currentView === 'stats' && <TaskStats />}
    </div>
  );
}
