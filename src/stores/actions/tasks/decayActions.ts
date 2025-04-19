
import { Task } from '@/types/task';
import { decaySkipCountsInDB } from '../taskActions';
import { supabase } from '@/integrations/supabase/client';

export const getDecayActions = (
  getTasks: () => Task[],
  setTasks: (tasks: Task[]) => void
) => () => ({
  decaySkipCounts: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
      
      await decaySkipCountsInDB(user.id);
      
      // Update local state with decayed skip counts
      const tasks = getTasks();
      const decayedTasks = tasks.map(task => ({
        ...task,
        skip_count: task.skip_count > 0 ? Math.floor(task.skip_count / 2) : 0
      }));
      
      setTasks(decayedTasks);
    } catch (error) {
      console.error('Error decaying skip counts:', error);
    }
  },
  
  checkAndApplyDecay: async () => {
    try {
      // Implement real decay check and application logic here
      console.log('Checking if decay should be applied...');
      
      // For now, we're just logging - actual implementation would check
      // dates and more sophisticated logic to determine if decay is needed
    } catch (error) {
      console.error('Error checking decay application:', error);
    }
  }
});
