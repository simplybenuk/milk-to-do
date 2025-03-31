
import { Task, Priority, TaskStatus, ClosedStatusReason } from '@/types/task';

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string) => Promise<void>;
  editTask: (id: string, title: string, priority: Priority) => Promise<void>;
  completeTask: (id: string, reason?: ClosedStatusReason) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  incrementSkipCount: (id: string) => Promise<void>;
  getTasksByPriority: () => Task[];
  getTaskStats: () => TaskStats;
}

export interface TaskStats {
  completedLastWeek: Task[];
  completedLastMonth: Task[];
  expired: Task[];
}
