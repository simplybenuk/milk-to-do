
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
