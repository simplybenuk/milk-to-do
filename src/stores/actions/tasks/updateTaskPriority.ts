
import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';

export const updateTaskPriorityInDB = async (id: string, priority: Priority): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id);

  if (error) throw error;
};
