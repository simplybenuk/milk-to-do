
import { Task } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { hasNewDayStarted } from '../../utils/taskScoring';
import { decaySkipCountsInDB } from './skipTask';

const LAST_DECAY_CHECK_KEY = 'sourlist_last_decay_check';

export const getDecayActions = (tasks: Task[], setTasks: (tasks: Task[]) => void) => ({
  decaySkipCounts: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
      
      localStorage.setItem(LAST_DECAY_CHECK_KEY, new Date().toISOString());
      await decaySkipCountsInDB(user.id);
      
      setTasks(tasks.map(task => ({
        ...task,
        skip_count: Math.floor(task.skip_count / 2)
      })));
      
      console.log('Skip counts decayed successfully');
    } catch (error) {
      console.error('Error decaying skip counts:', error);
      throw new Error('Failed to decay skip counts');
    }
  },

  checkAndApplyDecay: async () => {
    try {
      const lastCheckStr = localStorage.getItem(LAST_DECAY_CHECK_KEY);
      
      if (!lastCheckStr || hasNewDayStarted(new Date(lastCheckStr))) {
        console.log('Applying nightly skip count decay...');
        await getDecayActions(tasks, setTasks).decaySkipCounts();
      }
    } catch (error) {
      console.error('Error checking/applying decay:', error);
    }
  }
});
