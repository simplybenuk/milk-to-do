
import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';

// Export updateTaskPriorityInDB function if not already available
export const updateTaskPriorityInDB = async (id: string, priority: Priority): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id);

  if (error) throw error;
};

// Export incrementSkipCountInDB function
export const incrementSkipCountInDB = async (id: string): Promise<number> => {
  const { data, error } = await supabase.rpc('increment', { row_id: id });
  
  if (error) throw error;
  return data || 0; // Return the new skip count
};

// Export updateLastSkippedSessionInDB function
export const updateLastSkippedSessionInDB = async (id: string, sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ last_skipped_session: sessionId })
    .eq('id', id);
  
  if (error) throw error;
};

// Export refreshTaskExpiryInDB function
export const refreshTaskExpiryInDB = async (id: string): Promise<void> => {
  const newExpiryDate = new Date();
  newExpiryDate.setDate(newExpiryDate.getDate() + 30);
  
  const { error } = await supabase
    .from('tasks')
    .update({ expiry_date: newExpiryDate.toISOString() })
    .eq('id', id);

  if (error) throw error;
};

// Fix markTaskAsParentInDB function
export const markTaskAsParentInDB = async (id: string): Promise<void> => {
  // First, check if the task is already closed
  const { data: taskData, error: fetchError } = await supabase
    .from('tasks')
    .select('status')
    .eq('id', id)
    .single();
    
  if (fetchError) throw fetchError;
  
  const updates: any = { closed_status: 'parent' };
  
  // Only update status to 'closed' if it's not already closed
  // This avoids violating the valid_closed_status constraint
  if (taskData.status === 'open') {
    updates.status = 'closed';
  }
  
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

// Re-export all individual action functions
export * from './tasks/addTask';
export * from './tasks/completeTask';
export * from './tasks/deleteTask';
export * from './tasks/fetchTasks';
export * from './tasks/skipTask';
export * from './tasks/updateTask';
export * from './tasks/focusModeActions';
export * from './tasks/decayActions';
export * from './tasks/updateTaskPriority';
export * from './tasks/refreshTaskExpiryDate';
