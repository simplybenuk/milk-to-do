
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getBaseScore, 
  calculateAgeBonus, 
  calculatePenaltyFactor, 
  calculateFinalScore,
  calculateDecayedSkipCount
} from '../taskScoring';
import { Task } from '@/types/task';

describe('Task Scoring System', () => {
  // Test base score calculation
  it('should return correct base scores for different priorities', () => {
    expect(getBaseScore('high')).toBe(100);
    expect(getBaseScore('medium')).toBe(50);
    expect(getBaseScore('low')).toBe(25);
  });

  // Test age bonus calculation
  it('should calculate age bonus correctly', () => {
    const now = new Date();
    
    // 0 days old (no bonus)
    const newTask = new Date(now);
    expect(calculateAgeBonus(newTask)).toBe(0);
    
    // 15 days old (25 points)
    const fifteenDaysOld = new Date(now);
    fifteenDaysOld.setDate(now.getDate() - 15);
    expect(calculateAgeBonus(fifteenDaysOld)).toBe(25);
    
    // 30+ days old (max 50 points)
    const thirtyDaysOld = new Date(now);
    thirtyDaysOld.setDate(now.getDate() - 30);
    expect(calculateAgeBonus(thirtyDaysOld)).toBe(50);
    
    const fortyDaysOld = new Date(now);
    fortyDaysOld.setDate(now.getDate() - 40);
    expect(calculateAgeBonus(fortyDaysOld)).toBe(50); // Still 50 (capped)
  });

  // Test penalty factor calculation
  it('should calculate penalty factor correctly', () => {
    // No skips (no penalty)
    expect(calculatePenaltyFactor(0)).toBe(1);
    
    // 4 skips
    expect(calculatePenaltyFactor(4)).toBeCloseTo(0.8145, 4); // 0.95^4 ≈ 0.8145
    
    // 50 skips (should hit the floor of 0.5)
    expect(calculatePenaltyFactor(50)).toBe(0.5); // 0.95^50 is much less than 0.5
  });

  // Test midnight decay
  it('should calculate decayed skip count correctly', () => {
    expect(calculateDecayedSkipCount(0)).toBe(0);
    expect(calculateDecayedSkipCount(1)).toBe(0);
    expect(calculateDecayedSkipCount(4)).toBe(2);
    expect(calculateDecayedSkipCount(5)).toBe(2);
    expect(calculateDecayedSkipCount(10)).toBe(5);
  });

  // Test the final score calculation for specific scenarios
  it('should calculate correct final scores for specific scenarios', () => {
    const now = new Date();
    
    // Scenario 1: High-priority, age 0, 4 skips in one session → ~81.45 points
    const task1: Partial<Task> = {
      priority: 'high',
      created_at: now,
      skip_count: 4
    };
    expect(calculateFinalScore(task1 as Task)).toBe(81); // ~81.45, rounded
    
    // Scenario 2: Low-priority, age 28 days, 0 skips → 72 points
    const task2: Partial<Task> = {
      priority: 'low',
      created_at: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
      skip_count: 0
    };
    expect(calculateFinalScore(task2 as Task)).toBe(72); // 25 + 47 = 72
  });
});
