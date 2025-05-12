
import { supabase } from '@/integrations/supabase/client';

export const incrementSkipCountInDB = async (id: string): Promise<number> => {
  const { data, error } = await supabase
    .rpc('increment', { row_id: id });

  if (error) throw error;
  return data || 0; // Return the new skip count
};

export const updateLastSkippedSessionInDB = async (id: string, sessionId: string): Promise<void> => {
  const updates = {
    last_skipped_session: sessionId
  };
  
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const decaySkipCountsInDB = async (userId: string): Promise<void> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, skip_count')
    .eq('owner_id', userId);

  if (error) throw error;
  
  for (const task of data) {
    if (task.skip_count > 0) {
      const newSkipCount = Math.floor(task.skip_count / 2);
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ skip_count: newSkipCount })
        .eq('id', task.id);
        
      if (updateError) {
        console.error('Error decaying skip count for task:', task.id, updateError);
      }
    }
  }
};
