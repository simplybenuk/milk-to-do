
import { refreshAllParentTasksExpiry, checkAndCloseParentTask } from '../../utils/parentTaskUtils';
import { markTaskAsParentInDB } from '../taskActions';

export const getParentTaskActions = (set, get) => ({
  // After completing a task, also check if we need to close its parent
  completeTask: async (id: string, reason = 'complete') => {
    try {
      // Get the task we're completing to check if it has a parent
      const taskToComplete = get().tasks.find(t => t.id === id);
      const parentId = taskToComplete?.parent_id;
      
      // Call the original complete task function from core actions
      await get().coreCompleteTask(id, reason);
      
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
      set({ error: 'Failed to complete task' });
    }
  },
  
  // Mark a task as a parent task
  markTaskAsParent: async (id: string) => {
    try {
      await markTaskAsParentInDB(id);
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { 
            ...task, 
            closed_status: 'parent'
          } : task
        ),
      }));
      
      await get().fetchTasks();
    } catch (error) {
      console.error('Error marking task as parent:', error);
      set({ error: 'Failed to mark task as parent' });
    }
  },

  // Add a new function to refresh all parent task expiry dates
  refreshParentTasksExpiry: async () => {
    try {
      set({ isLoading: true });
      await refreshAllParentTasksExpiry(get().tasks);
      await get().fetchTasks(); // Refresh tasks to get updated data
    } catch (error) {
      console.error('Error refreshing parent task expiry dates:', error);
      set({ error: 'Failed to refresh parent task expiry dates' });
    } finally {
      set({ isLoading: false });
    }
  }
});
