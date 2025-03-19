
import { AllTasksList } from '@/components/AllTasksList';
import { ClosedTasksList } from '@/components/ClosedTasksList';
import { TaskStats } from '@/components/TaskStats';
import { CurrentTask } from '@/components/CurrentTask';
import { AppView } from '@/hooks/useAppView';

interface MainContentProps {
  currentView: AppView;
  currentTask?: any;
  onComplete: (taskId: string) => void;
  onSkip: () => void;
  onReturnToTop: () => void;
  currentIndex: number;
  sortedOpenTasks: any[];
}

export function MainContent({
  currentView,
  currentTask,
  onComplete,
  onSkip,
  onReturnToTop,
  currentIndex,
  sortedOpenTasks
}: MainContentProps) {
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
      return sortedOpenTasks.length > 0 ? (
        <CurrentTask
          task={currentTask}
          onComplete={onComplete}
          onSkip={onSkip}
          onReturnToTop={onReturnToTop}
          currentIndex={currentIndex}
          totalTasks={sortedOpenTasks.length}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-milk-500">No tasks yet. Add your first task!</p>
        </div>
      );
  }
}
