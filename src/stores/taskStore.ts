
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
    ...decayActions(),
  };
});

export default useTaskStore;
