
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { TaskStoreState } from './types/taskStoreState.types';
import { Priority } from '@/types/task';
import {
  incrementSkipCountInDB,
  updateLastSkippedSessionInDB,
  updateTaskPriorityInDB
} from './actions/taskActions';
import { getFocusModeActions } from './actions/tasks/focusModeActions';
import { getDecayActions } from './actions/tasks/decayActions';
import { getCoreTaskActions } from './actions/tasks/coreTaskActions';

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

  // Initialize with defaults
  const initialState: TaskStoreState = {
    tasks: [],
    isLoading: false,
    error: null,
    sessionId: crypto.randomUUID()
  };

  // Get tasks accessor function
  const getTasks = () => get().tasks;

  // Initialize actions with proper dependencies
  const coreActions = getCoreTaskActions(setState, set, get);
  const focusModeActions = getFocusModeActions(getTasks);
  const decayActions = getDecayActions(() => get().tasks, (tasks) => set({ tasks }));

  return {
    // Initial state
    ...initialState,

    // Core task operations
    ...coreActions,

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
        setState({ error: 'Failed to update task priority' });
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
        setState({ error: 'Failed to increment skip count' });
      }
    },

    // Focus mode and utility actions
    ...focusModeActions,
    ...decayActions()
  };
});

export default useTaskStore;
