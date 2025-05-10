
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { TaskStoreState } from './types/taskStoreState.types';
import { Priority } from '@/types/task';
import { addDays } from 'date-fns';
import {
  incrementSkipCountInDB,
  updateLastSkippedSessionInDB,
  updateTaskPriorityInDB,
  refreshTaskExpiryInDB
} from './actions/taskActions';
import { getFocusModeActions } from './actions/tasks/focusModeActions';
import { getDecayActions } from './actions/tasks/decayActions';
import { getCoreTaskActions } from './actions/tasks/coreTaskActions';
import { refreshAllParentTasksExpiry, checkAndCloseParentTask } from './utils/parentTaskUtils';

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

    // After completing a task, also check if we need to close its parent
    completeTask: async (id: string, reason = 'complete') => {
      try {
        // Get the task we're completing to check if it has a parent
        const taskToComplete = get().tasks.find(t => t.id === id);
        const parentId = taskToComplete?.parent_id;
        
        // Call the original complete task function from core actions
        await coreActions.completeTask(id, reason);
        
        // If this was a child task, check if parent should be closed too
        if (parentId) {
          const parentTask = get().tasks.find(t => t.id === parentId);
          const allTasks = get().tasks;
          
          // Only process if we found a parent task
          if (parentTask) {
            // Check if parent should be closed and close it if needed
            const shouldCloseParent = await checkAndCloseParentTask(parentId, allTasks);
            if (shouldCloseParent) {
              // Update local state for the parent task
              set(state => ({
                tasks: state.tasks.map(task =>
                  task.id === parentId ? { 
                    ...task, 
                    status: 'closed',
                    closed_status: 'complete',
                    completed_at: new Date()
                  } : task
                ),
              }));
            }
          }
        }
        
        // Refresh the task list to get updated data
        await get().fetchTasks();
      } catch (error) {
        console.error('Error completing task:', error);
        setState({ error: 'Failed to complete task' });
      }
    },

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
        setState({ error: 'Failed to refresh task expiry date' });
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
    ...decayActions(),

    // Add a new function to refresh all parent task expiry dates
    refreshParentTasksExpiry: async () => {
      try {
        setState({ isLoading: true });
        await refreshAllParentTasksExpiry(get().tasks);
        await get().fetchTasks(); // Refresh tasks to get updated data
      } catch (error) {
        console.error('Error refreshing parent task expiry dates:', error);
        setState({ error: 'Failed to refresh parent task expiry dates' });
      } finally {
        setState({ isLoading: false });
      }
    }
  };
});

export default useTaskStore;
