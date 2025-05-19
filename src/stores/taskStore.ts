
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { getCoreTaskActions } from './actions/tasks/coreTaskActions';
import { getFocusModeActions } from './actions/tasks/focusModeActions';
import { getDecayActions } from './actions/tasks/decayActions';
import { getParentTaskActions } from './actions/tasks/parentTaskActions';
import { getPriorityActions } from './actions/tasks/priorityActions';

/**
 * Central store for managing tasks in the application
 */
const useTaskStore = create<TaskStore>((setState, getState) => {
  // Get tasks accessor function
  const getTasks = () => getState().tasks;

  // Initialize with defaults
  const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    sessionId: crypto.randomUUID()
  };

  // Initialize actions with proper dependencies
  const coreActions = getCoreTaskActions(setState, getState);
  const focusModeActions = getFocusModeActions(getTasks);
  const decayActions = getDecayActions(getTasks, (tasks) => setState({ tasks }));
  const parentTaskActions = getParentTaskActions(setState, getState);
  const priorityActions = getPriorityActions(setState, getState);

  // Add placeholder for setTaskExpiryWarnings
  const setTaskExpiryWarnings = () => {
    const tasks = getTasks();
    // Apply expiry warnings to tasks
    const now = new Date();
    const warningTasks = tasks.map(task => {
      if (task.status === 'open') {
        const daysLeft = Math.floor((task.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...task,
          warning: daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low'
        };
      }
      return task;
    });
    setState({ tasks: warningTasks });
  };

  return {
    // Initial state
    ...initialState,

    // Core task operations
    ...coreActions,
    
    // Parent task operations
    ...parentTaskActions,
    
    // Priority and expiry operations
    ...priorityActions,

    // Focus mode and utility actions
    ...focusModeActions,
    ...decayActions,
    
    // Add missing setTaskExpiryWarnings function
    setTaskExpiryWarnings,
  };
});

export default useTaskStore;
