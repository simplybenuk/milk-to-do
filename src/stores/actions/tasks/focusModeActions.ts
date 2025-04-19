
import { Task } from '@/types/task';
import { calculateTaskStats, sortTasksByPriority } from '../../utils/taskUtils';
import { sortTasksForFocusMode } from '../../utils/taskScoring';

export const getFocusModeActions = (tasks: Task[]) => ({
  getTasksByPriority: () => {
    return sortTasksByPriority(tasks);
  },

  getSortedTasksForFocusMode: () => {
    const openTasks = tasks.filter(task => task.status === 'open');
    return sortTasksForFocusMode(openTasks);
  },

  getTaskStats: () => {
    return calculateTaskStats(tasks);
  }
});
