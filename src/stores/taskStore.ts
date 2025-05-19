
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
const useTaskStore = create<TaskStore>((set, get) => {
  // Get tasks accessor function
  const getTasks = () => get().tasks;

  // Initialize with defaults
  const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    sessionId: crypto.randomUUID()
  };

  // Initialize actions with proper dependencies
  const coreActions = getCoreTaskActions(set, get);
  const focusModeActions = getFocusModeActions(getTasks);
  const decayActions = getDecayActions(getTasks, (tasks) => set({ tasks }));
  const parentTaskActions = getParentTaskActions(set, get);
  const priorityActions = getPriorityActions(set, get);

  // Add setTaskExpiryWarnings with memoization to prevent infinite updates
  const setTaskExpiryWarnings = () => {
    const tasks = getTasks();
    const now = new Date();
    
    // Check if we actually need to update any tasks
    let needsUpdate = false;
    
    // Apply expiry warnings to tasks
    const warningTasks = tasks.map(task => {
      if (task.status === 'open') {
        const expiryDate = task.expiry_date instanceof Date 
          ? task.expiry_date 
          : new Date(task.expiry_date);
          
        const daysLeft = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const newWarning = daysLeft <= 3 ? 'high' : daysLeft <= 7 ? 'medium' : 'low';
        
        // Only update if the warning level actually changed
        if (task.warning !== newWarning) {
          needsUpdate = true;
          return {
            ...task,
            warning: newWarning
          };
        }
      }
      return task;
    });
    
    // Only update state if at least one task's warning level changed
    if (needsUpdate) {
      set({ tasks: warningTasks });
    }
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
    
    // Add setTaskExpiryWarnings function
    setTaskExpiryWarnings,
  };
});

export default useTaskStore;
