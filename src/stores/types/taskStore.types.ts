
import { Task, Priority } from "@/types/task";

export interface TaskStore {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  totalTaskCount?: number; // Add total count for pagination
  
  // Core task operations
  fetchTasks: (options?: any) => Promise<Task[]>;
  fetchTasksByView: (viewName: string) => Promise<Task[]>;
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string, tagIds?: string[]) => Promise<Task | null>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  
  // Skip operations
  incrementSkipCount: (id: string) => Promise<number>;
  
  // Parent-child operations
  createChildTask: (parentId: string, title: string, priority: Priority, expiryDate: Date, tagIds?: string[]) => Promise<Task | null>;
  getChildTasks: (parentId: string) => Task[];
  markTaskAsParent: (id: string) => Promise<void>;
  
  // Priority operations
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  refreshTaskExpiryDate: (id: string) => Promise<void>;
  
  // Focus mode operations
  getSortedTasksForFocusMode: () => Task[];
  
  // Task decay/aging
  setTaskExpiryWarnings: () => void;
}
