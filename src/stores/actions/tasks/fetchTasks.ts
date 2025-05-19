
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { convertDatabaseDatesToDateObjects } from '../../utils/taskUtils';

export const fetchTasksFromDB = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('owner_id', userId)
    .order('priority_score', { ascending: false });

  if (error) throw error;
  return data.map(convertDatabaseDatesToDateObjects);
};
