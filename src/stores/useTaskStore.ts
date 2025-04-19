
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { TaskStoreState } from './types/taskStoreState.types';
import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';
import {
  fetchTasksFromDB,
  addTaskToDB,
  completeTaskInDB,
  deleteTaskFromDB,
  incrementSkipCountInDB,
  updateTaskInDB,
  updateLastSkippedSessionInDB,
  updateTaskPriorityInDB
} from './actions/taskActions';
import { getFocusModeActions } from './actions/tasks/focusModeActions';
import { getDecayActions } from './actions/tasks/decayActions';

const useTaskStore = create<TaskStore>((set, get) => {
  const getState = (): TaskStoreState => ({
    tasks: get().tasks,
    isLoading: get().isLoading,
    error: get().error,
    sessionId: get().sessionId
  });

  const setState = (newState: Partial<TaskStoreState>) => {
    set((state) => ({ ...state, ...newState }));
  };

  const focusModeActions = () => getFocusModeActions(get().tasks);
  const decayActions = () => getDecayActions(get().tasks, (tasks) => set({ tasks }));

  return {
    // Initial state
    tasks: [],
    isLoading: false,
    error: null,
    sessionId: crypto.randomUUID(),

    // Basic task operations
    fetchTasks: async () => {
      setState({ isLoading: true, error: null });
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        await decayActions().checkAndApplyDecay();
        const tasks = await fetchTasksFromDB(user.id);
        setState({ tasks, isLoading: false });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setState({ error: 'Failed to fetch tasks', isLoading: false });
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
        setState({ error: 'Failed to add task' });
      }
    },

    editTask: async (id, title, priority, tagIds) => {
      try {
        await updateTaskInDB(id, { title, priority, tags: tagIds || [] });
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, title, priority, tags: tagIds || task.tags }
              : task
          ),
        }));
        await get().fetchTasks();
      } catch (error) {
        console.error('Error editing task:', error);
        setState({ error: 'Failed to edit task' });
      }
    },

    completeTask: async (id, reason = 'complete') => {
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
        setState({ error: 'Failed to complete task' });
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
        setState({ error: 'Failed to delete task' });
      }
    },

    updateTaskPriority: async (id, priority: Priority) => {
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
        setState({ error: 'Failed to update task priority' });
      }
    },

    incrementSkipCount: async (id) => {
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
        setState({ error: 'Failed to increment skip count' });
      }
    },

    // Focus mode and utility actions
    ...focusModeActions(),
    ...decayActions()
  };
});

export default useTaskStore;
