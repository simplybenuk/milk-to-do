
import { refreshAllParentTasksExpiry, checkAndCloseParentTask } from '../../utils/parentTaskUtils';
import { markTaskAsParentInDB } from '../taskActions';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Mark a task as a parent task and handle child task associations
  markTaskAsParent: async (id: string) => {
    try {
      // First mark the task as a parent in the database
      await markTaskAsParentInDB(id);
      
      // Update the local state to reflect the change
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { 
            ...task, 
            closed_status: 'parent',
            // Only set status to 'closed' if it's not already closed
            ...(task.status === 'open' ? { status: 'closed' } : {})
          } : task
        ),
      }));
      
    } catch (error) {
      console.error('Error marking task as parent:', error);
      set({ error: 'Failed to mark task as parent' });
    }
  },
  
  // Add child task ID to parent's child_task_ids array
  updateParentWithChild: async (parentId: string, childId: string) => {
    try {
      // First get the parent task to check its current child_task_ids
      const { data: parentTask, error: fetchError } = await supabase
        .from('tasks')
        .select('child_task_ids')
        .eq('id', parentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Create new array with the child ID added
      const updatedChildIds = [...(parentTask.child_task_ids || [])];
      if (!updatedChildIds.includes(childId)) {
        updatedChildIds.push(childId);
      }
      
      // Update the parent task with the new child_task_ids array
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ child_task_ids: updatedChildIds })
        .eq('id', parentId);
        
      if (updateError) throw updateError;
      
      // Update the local state to reflect this change
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === parentId ? { 
            ...task, 
            child_task_ids: updatedChildIds
          } : task
        ),
      }));
      
    } catch (error) {
      console.error('Error updating parent with child ID:', error);
      set({ error: 'Failed to update parent-child relationship' });
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
