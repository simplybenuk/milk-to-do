
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
  completed_at?: Date;
  expired_at?: Date;
  status: TaskStatus;
  closed_status?: ClosedStatusReason;
  parent_id?: string;
  child_task_ids: string[];
  skip_count: number;
  last_skipped_session?: string;
  tags: string[];
  priority_score: number;
}
