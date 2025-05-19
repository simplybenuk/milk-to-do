
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

export const createFetchTasksFunction = (set: any, get: any) => {
  // Instead of using useCallback, we'll create a regular memoized function
  // that we'll only initialize once when the store is created
  const fetchTasks = async () => {
    const state = get();
    if (state.isLoading) return; // Prevent multiple simultaneous fetches
    
    set({ isLoading: true, error: null });
    
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        set({ isLoading: false, error: 'User not authenticated' });
        return;
      }
      
      const tasks = await fetchTasksFromDB(user.id);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks'
      });
    }
  };
  
  return fetchTasks;
};
