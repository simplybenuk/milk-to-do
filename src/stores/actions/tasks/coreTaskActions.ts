
import { Task, Priority, ClosedStatusReason } from '@/types/task';
import { 
  addTaskToDB, 
  updateTaskInDB, 
  completeTaskInDB,
  deleteTaskFromDB,
  fetchTasksFromDB 
} from '../taskActions';
import { supabase } from '@/integrations/supabase/client';

export const getCoreTaskActions = (set, get) => ({
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const tasks = await fetchTasksFromDB(user.id);
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (title: string, priority: Priority, expiryDate: Date, parentId?: string, tagIds: string[] = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Add the task to the database
      const newTaskId = await addTaskToDB(title, priority, expiryDate, user.id, parentId, tagIds);
      
      // If this is a child task, update the parent task's child_task_ids array
      if (parentId && newTaskId) {
        try {
          // Fetch current parent task to get its child_task_ids
          const { data: parentTask, error: fetchError } = await supabase
            .from('tasks')
            .select('child_task_ids')
            .eq('id', parentId)
            .single();
            
          if (fetchError) throw fetchError;
          
          // Update parent task's child_task_ids array
          const updatedChildIds = [...(parentTask.child_task_ids || [])];
          if (!updatedChildIds.includes(newTaskId)) {
            updatedChildIds.push(newTaskId);
          }
          
          const { error: updateError } = await supabase
            .from('tasks')
            .update({ child_task_ids: updatedChildIds })
            .eq('id', parentId);
            
          if (updateError) throw updateError;
          
          // Also make sure the parent is marked correctly
          const { error: parentError } = await supabase
            .from('tasks')
            .update({ closed_status: 'parent' })
            .eq('id', parentId);
            
          if (parentError) throw parentError;
          
        } catch (error) {
          console.error('Error updating parent task child_task_ids:', error);
        }
      }
      
      // Reload tasks to get the latest state including the new task and updated relationships
      await get().fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
    }
  },

  editTask: async (id: string, title: string, priority: Priority, tagIds?: string[]) => {
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
      set({ error: 'Failed to edit task' });
    }
  },

  // This is now the "core" complete task that is called by the wrapped completeTask in parentTaskActions
  coreCompleteTask: async (id: string, reason: ClosedStatusReason = 'complete') => {
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

  deleteTask: async (id: string) => {
    try {
      await deleteTaskFromDB(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task' });
    }
  }
});
