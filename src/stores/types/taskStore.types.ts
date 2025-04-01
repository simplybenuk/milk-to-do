
import { Task, Priority, TaskStatus, ClosedStatusReason } from '@/types/task';

export interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  userSubscription: UserSubscription;
  userId?: string;  // Add userId property
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string) => Promise<void>;
  editTask: (id: string, title: string, priority: Priority) => Promise<void>;
  completeTask: (id: string, reason?: ClosedStatusReason) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  incrementSkipCount: (id: string) => Promise<void>;
  getTasksByPriority: () => Task[];
  getTaskStats: () => TaskStats;
  setUserSubscription: (subscription: UserSubscription) => void;
  hasProAccess: () => boolean;
  logout: () => Promise<void>; // Add logout method
}

export interface TaskStats {
  completedLastWeek: Task[];
  completedLastMonth: Task[];
  expired: Task[];
}

export interface UserSubscription {
  tier: 'free' | 'pro';
  expiresAt: Date | null;
}
