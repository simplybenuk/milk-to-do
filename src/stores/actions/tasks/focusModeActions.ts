
import { Task } from '@/types/task';
import { calculateTaskStats, sortTasksByPriority } from '../../utils/taskUtils';
import { sortTasksForFocusMode } from '../../utils/taskScoring';

export const getFocusModeActions = (getTasks: () => Task[]) => ({
  getTasksByPriority: () => {
    return sortTasksByPriority(getTasks());
  },

  getSortedTasksForFocusMode: () => {
    const openTasks = getTasks().filter(task => task.status === 'open');
    return sortTasksForFocusMode(openTasks);
  },

  getTaskStats: () => {
    return calculateTaskStats(getTasks());
  }
});
