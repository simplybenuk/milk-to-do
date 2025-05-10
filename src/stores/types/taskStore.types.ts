
import { Task, Priority, TaskStatus, ClosedStatusReason } from '@/types/task';

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string, tagIds?: string[]) => Promise<void>;
  editTask: (id: string, title: string, priority: Priority, tagIds?: string[]) => Promise<void>;
  completeTask: (id: string, reason?: ClosedStatusReason) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  incrementSkipCount: (id: string) => Promise<void>;
  refreshTaskExpiry: (id: string) => Promise<void>;
  refreshParentTasksExpiry: () => Promise<void>;
  markTaskAsParent: (id: string) => Promise<void>;
  decaySkipCounts: () => Promise<void>;
  checkAndApplyDecay: () => Promise<void>;
  getTasksByPriority: () => Task[];
  getSortedTasksForFocusMode: () => Task[];
  getTaskStats: () => TaskStats;
}

export interface TaskStats {
  completedLastWeek: Task[];
  completedLastMonth: Task[];
  expired: Task[];
}
