
import { Task } from '@/types/task';

export const convertDatabaseDatesToDateObjects = (task: any): Task => ({
  ...task,
  created_at: new Date(task.created_at),
  expiry_date: new Date(task.expiry_date),
  completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
  expired_at: task.expired_at ? new Date(task.expired_at) : undefined,
  child_task_ids: task.child_task_ids || [],
  tags: task.tags || [],
  skip_count: task.skip_count || 0,
});

export const calculateTaskStats = (tasks: Task[]) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    completedLastWeek: tasks.filter(task => 
      task.completed_at && 
      task.completed_at >= oneWeekAgo
    ),
    completedLastMonth: tasks.filter(task => 
      task.completed_at && 
      task.completed_at >= oneMonthAgo
    ),
    expired: tasks.filter(task => 
      task.closed_status === 'expired' && task.expired_at !== null
    ),
  };
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  if (!tasks || tasks.length === 0) return [];
  
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'closed' ? 1 : -1;
    return ((b.priority_score || 0) - (a.priority_score || 0));
  });
};
