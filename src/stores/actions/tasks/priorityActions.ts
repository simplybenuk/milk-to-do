
import { Priority } from '@/types/task';
import { addDays } from 'date-fns';
import { 
  updateTaskPriorityInDB, 
  refreshTaskExpiryInDB, 
  incrementSkipCountInDB,
  updateLastSkippedSessionInDB
} from '../taskActions';

export const getPriorityActions = (set, get) => ({
  // Update task priority
  updateTaskPriority: async (id: string, priority: Priority) => {
    try {
      await updateTaskPriorityInDB(id, priority);
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, priority } : task
        ),
      }));
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },
  
  // Refresh task expiry date
  refreshTaskExpiry: async (id: string) => {
    try {
      await refreshTaskExpiryInDB(id);
      const newExpiryDate = addDays(new Date(), 30);
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { 
            ...task, 
            expiry_date: newExpiryDate,
            status: 'open',
            skip_count: 0
          } : task
        ),
      }));
      
      await get().fetchTasks();
    } catch (error) {
      console.error('Error refreshing task expiry date:', error);
      set({ error: 'Failed to refresh task expiry date' });
    }
  },

  // Skip operations
  incrementSkipCount: async (id: string) => {
    try {
      const { sessionId } = get();
      const task = get().tasks.find(task => task.id === id);
      
      if (!task) {
        console.error('Task not found:', id);
        return;
      }
      
      if (task.last_skipped_session === sessionId) {
        console.log('Task already skipped in this session:', id);
        return;
      }
      
      await incrementSkipCountInDB(id);
      await updateLastSkippedSessionInDB(id, sessionId);
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { 
                ...task, 
                skip_count: task.skip_count + 1,
                last_skipped_session: sessionId
              }
            : task
        ),
      }));
      
      await get().fetchTasks();
    } catch (error) {
      console.error('Error incrementing skip count:', error);
      set({ error: 'Failed to increment skip count' });
    }
  },
});
