
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchTasksFromDB,
  addTaskToDB,
  completeTaskInDB,
  deleteTaskFromDB,
  updateTaskPriorityInDB,
  incrementSkipCountInDB,
  updateTaskInDB,
  updateLastSkippedSessionInDB,
  decaySkipCountsInDB,
} from './actions/taskActions';
import { 
  calculateTaskStats, 
  sortTasksByPriority 
} from './utils/taskUtils';
import { 
  sortTasksForFocusMode, 
  hasNewDayStarted,
  calculateDecayedSkipCount
} from './utils/taskScoring';
import { ClosedStatusReason, Priority } from '@/types/task';

const LAST_DECAY_CHECK_KEY = 'sourlist_last_decay_check';

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  sessionId: crypto.randomUUID(), // Generate unique session ID

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Check for midnight decay when fetching tasks
      await get().checkAndApplyDecay();
      
      const tasks = await fetchTasksFromDB(user.id);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (title, priority, expiryDate, parentId, tagIds = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      await addTaskToDB(title, priority, expiryDate, user.id, parentId, tagIds);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
    }
  },

  editTask: async (id, title, priority, tagIds) => {
    try {
      await updateTaskInDB(id, { title, priority, tags: tagIds });
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, title, priority, tags: tagIds || task.tags }
            : task
        ),
      }));
      // Fetch tasks to get updated priority score calculation
      await get().fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
      set({ error: 'Failed to edit task' });
    }
  },

  completeTask: async (id, reason = 'complete' as ClosedStatusReason) => {
    try {
      await completeTaskInDB(id, reason);
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { 
                ...task, 
                status: 'closed', 
                closed_status: reason,
                completed_at: reason === 'complete' ? new Date() : undefined
              }
            : task
        ),
      }));
    } catch (error) {
      console.error('Error completing task:', error);
      set({ error: 'Failed to complete task' });
    }
  },

  deleteTask: async (id) => {
    try {
      await deleteTaskFromDB(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task' });
    }
  },

  updateTaskPriority: async (id, priority) => {
    try {
      await updateTaskPriorityInDB(id, priority);
      // Update the local state immediately to avoid UI jumps
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, priority }
            : task
        ),
      }));
      // Then fetch the full updated list (which will include recalculated priority scores)
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },

  incrementSkipCount: async (id) => {
    try {
      const { sessionId } = get();
      const task = get().tasks.find(task => task.id === id);
      
      // Skip if task doesn't exist
      if (!task) {
        console.error('Task not found:', id);
        return;
      }
      
      // Skip if the task was already skipped in this session
      if (task.last_skipped_session === sessionId) {
        console.log('Task already skipped in this session:', id);
        return;
      }
      
      // Update the task in the database
      await incrementSkipCountInDB(id);
      await updateLastSkippedSessionInDB(id, sessionId);
      
      // Update local state to show the skip immediately
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
      
      // Then fetch full task list for accurate sorting
      await get().fetchTasks();
    } catch (error) {
      console.error('Error incrementing skip count:', error);
      set({ error: 'Failed to increment skip count' });
    }
  },

  decaySkipCounts: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
      
      // Update the last decay check timestamp
      localStorage.setItem(LAST_DECAY_CHECK_KEY, new Date().toISOString());
      
      // Perform the decay operation in the database
      await decaySkipCountsInDB(user.id);
      
      // Update local state with decayed skip counts
      set(state => ({
        tasks: state.tasks.map(task => ({
          ...task,
          skip_count: calculateDecayedSkipCount(task.skip_count)
        }))
      }));
      
      console.log('Skip counts decayed successfully');
    } catch (error) {
      console.error('Error decaying skip counts:', error);
      set({ error: 'Failed to decay skip counts' });
    }
  },

  checkAndApplyDecay: async () => {
    try {
      // Get the timestamp of the last decay check
      const lastCheckStr = localStorage.getItem(LAST_DECAY_CHECK_KEY);
      
      // If no previous check or a new day has started since the last check
      if (!lastCheckStr || hasNewDayStarted(new Date(lastCheckStr))) {
        console.log('Applying nightly skip count decay...');
        await get().decaySkipCounts();
      }
    } catch (error) {
      console.error('Error checking/applying decay:', error);
    }
  },

  getTasksByPriority: () => {
    return sortTasksByPriority(get().tasks);
  },

  getSortedTasksForFocusMode: () => {
    // Filter for open tasks only, then sort by our focus mode criteria
    const openTasks = get().tasks.filter(task => task.status === 'open');
    return sortTasksForFocusMode(openTasks);
  },

  getTaskStats: () => {
    return calculateTaskStats(get().tasks);
  },
}));

export default useTaskStore;
