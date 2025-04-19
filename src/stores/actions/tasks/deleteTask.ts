
import { supabase } from '@/integrations/supabase/client';

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  const { error: tagsError } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', id);

  if (tagsError) console.error('Error deleting task-tag relations:', tagsError);
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
