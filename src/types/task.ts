
export type Priority = "low" | "medium" | "high";
export type TaskStatus = "open" | "closed";
export type ClosedStatusReason = "expired" | "complete" | "parent";

export interface Task {
  id: string;
  owner_id: string;
  title: string;
  priority: Priority;
  created_at: Date;
  expiry_date: Date;
  status: TaskStatus;
  closed_status?: ClosedStatusReason;
  parent_id?: string;
  child_task_ids: string[];
  skip_count: number;
  tags: string[];
}
