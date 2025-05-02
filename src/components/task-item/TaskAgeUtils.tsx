
import { Task } from '@/types/task';
import { differenceInDays } from 'date-fns';

/**
 * Determines the age class of a task based on its expiry date and creation date
 */
export function getTaskAgeClass(task: Task) {
  const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
  const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
  
  // If task has been refreshed recently (more than 25 days left), consider it fresh
  if (daysUntilExpiry >= 25) {
    return "task-fresh";
  }
  
  if (daysUntilExpiry < 0) return "task-expired";
  if (ageInDays >= 21) return "task-sour";
  if (ageInDays >= 8) return "task-spoiling"; 
  return "task-fresh";
}

