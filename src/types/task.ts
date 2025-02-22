
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  expiryDate: Date;
  completed: boolean;
  createdAt: Date;
  parentId?: string;
  subtasks?: Task[];
}
