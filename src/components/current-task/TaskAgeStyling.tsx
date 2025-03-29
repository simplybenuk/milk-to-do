
import { Task } from '@/types/task';
import { differenceInDays } from 'date-fns';

export function getButtonStyles(task: Task | null) {
  if (!task) return {};
  
  const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
  const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
  
  if (daysUntilExpiry < 0) {
    return {
      complete: "bg-expired-accent hover:bg-expired-accent/90 text-white",
      skip: "border-expired-accent/50 text-expired-text hover:bg-expired-bg/50"
    };
  }
  
  if (ageInDays >= 21) {
    return {
      complete: "bg-sour-accent hover:bg-sour-accent/90 text-white",
      skip: "border-sour-accent/50 text-sour-text hover:bg-sour-bg/50"
    };
  }
  
  if (ageInDays >= 8) {
    return {
      complete: "bg-spoiling-accent hover:bg-spoiling-accent/90 text-spoiling-text",
      skip: "border-spoiling-accent/50 text-spoiling-text hover:bg-spoiling-bg/50"
    };
  }
  
  return {
    complete: "bg-green-500 hover:bg-green-600 text-white",
    skip: "border-fresh-accent/50 text-fresh-text hover:bg-fresh-bg/50"
  };
}
