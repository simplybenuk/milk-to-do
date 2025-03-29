
import { Task } from '@/types/task';
import { differenceInDays } from 'date-fns';

export function getButtonStyles(task: Task | null) {
  if (!task) {
    // Return default button styles when task is null
    return {
      complete: "bg-green-500 hover:bg-green-600 text-white",
      skip: "border-fresh-accent/50 text-fresh-text hover:bg-fresh-bg/50"
    };
  }
  
  const ageInDays = differenceInDays(new Date(), new Date(task.created_at));
  const daysUntilExpiry = differenceInDays(new Date(task.expiry_date), new Date());
  
  if (daysUntilExpiry < 0) {
    return {
      complete: "bg-expired-accent hover:bg-expired-accent/90 text-white font-bold",
      skip: "border-expired-accent text-expired-text hover:bg-expired-bg font-bold"
    };
  }
  
  if (ageInDays >= 21) {
    return {
      complete: "bg-sour-accent hover:bg-sour-accent/90 text-white font-bold",
      skip: "border-sour-accent text-sour-text hover:bg-sour-bg font-bold"
    };
  }
  
  if (ageInDays >= 8) {
    return {
      complete: "bg-spoiling-accent hover:bg-spoiling-accent/90 text-white font-bold",
      skip: "border-spoiling-accent text-spoiling-text hover:bg-spoiling-bg font-bold"
    };
  }
  
  return {
    complete: "bg-green-600 hover:bg-green-700 text-white font-bold",
    skip: "border-fresh-accent text-fresh-text hover:bg-fresh-bg font-bold"
  };
}
