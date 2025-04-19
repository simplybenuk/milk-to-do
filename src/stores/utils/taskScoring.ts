
import { Task } from '@/types/task';

/**
 * Calculates the base score for a task based on its priority
 */
export const getBaseScore = (priority: Task['priority']): number => {
  switch (priority) {
    case 'high': return 100;
    case 'medium': return 50;
    case 'low': return 25;
    default: return 0;
  }
};

/**
 * Calculates the age bonus (0-50 points) based on task age
 * Age bonus increases linearly from 0 to 50 over 30 days
 */
export const calculateAgeBonus = (createdAt: Date): number => {
  const now = new Date();
  const ageInDays = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  // Clamp age to 30 days max
  const clampedAge = Math.min(ageInDays, 30);
  // Linear scaling: 0 days = 0 bonus, 30 days = 50 bonus
  return Math.round(50 * clampedAge / 30);
};

/**
 * Calculates the penalty factor based on skip count
 * Penalty factor = 0.95^skipCount, with a floor of 0.5
 */
export const calculatePenaltyFactor = (skipCount: number): number => {
  const factor = Math.pow(0.95, skipCount);
  // Ensure penalty factor never goes below 0.5
  return Math.max(factor, 0.5);
};

/**
 * Calculates the final score for a task
 */
export const calculateFinalScore = (task: Task): number => {
  const baseScore = getBaseScore(task.priority);
  const ageBonus = calculateAgeBonus(new Date(task.created_at));
  const penaltyFactor = calculatePenaltyFactor(task.skip_count);
  
  return Math.round((baseScore + ageBonus) * penaltyFactor);
};

/**
 * Sorts tasks for focus mode based on the new scoring system
 * Order: finalScore DESC, ageDays DESC, skipCount ASC
 */
export const sortTasksForFocusMode = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by final score (descending)
    const scoreA = calculateFinalScore(a);
    const scoreB = calculateFinalScore(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    
    // If scores are equal, sort by age (descending)
    const ageA = new Date().getTime() - new Date(a.created_at).getTime();
    const ageB = new Date().getTime() - new Date(b.created_at).getTime();
    if (ageA !== ageB) return ageB - ageA;
    
    // If ages are equal, sort by skip count (ascending)
    return a.skip_count - b.skip_count;
  });
};

/**
 * Calculates the number of skips after midnight decay
 * Skip count is halved (rounded down) at local midnight
 */
export const calculateDecayedSkipCount = (skipCount: number): number => {
  return Math.floor(skipCount / 2);
};

/**
 * Checks if a new day has started since the last check
 * Used to implement the nightly decay on client-side
 */
export const hasNewDayStarted = (lastCheckDate: Date): boolean => {
  const now = new Date();
  // Compare the date parts only
  return now.getDate() !== lastCheckDate.getDate() || 
         now.getMonth() !== lastCheckDate.getMonth() || 
         now.getFullYear() !== lastCheckDate.getFullYear();
};
