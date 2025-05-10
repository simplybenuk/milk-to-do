
import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';

// Export markTaskAsParentInDB function
export const markTaskAsParentInDB = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ closed_status: 'parent' })
    .eq('id', id);

  if (error) throw error;
};

// Export updateTaskPriorityInDB function if not already available
export const updateTaskPriorityInDB = async (id: string, priority: Priority): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id);

  if (error) throw error;
};

// Export incrementSkipCountInDB function
export const incrementSkipCountInDB = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment', { row_id: id });
  
  if (error) throw error;
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
