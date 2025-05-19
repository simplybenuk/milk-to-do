
import { supabase } from '@/integrations/supabase/client';
import { Priority, Task } from '@/types/task';
import { markTaskAsParentInDB } from '../taskActions';

export const getParentTaskActions = (set, get) => ({
  // Get child tasks for a parent task
  getChildTasks: (parentId: string): Task[] => {
    const tasks = get().tasks;
    return tasks.filter(task => task.parent_id === parentId);
  },
  
  // Mark a task as a parent task
  markTaskAsParent: async (id: string): Promise<void> => {
    try {
      await markTaskAsParentInDB(id);
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, status: 'closed', closed_status: 'parent' }
            : task
        ),
      }));
      
      await get().fetchTasks();
    } catch (error) {
      console.error('Error marking task as parent:', error);
      set({ error: 'Failed to mark task as parent' });
    }
  },
  
  // Create a child task for a parent task
  createChildTask: async (
    parentId: string, 
    title: string, 
    priority: Priority, 
    expiryDate: Date,
    tagIds?: string[]
  ): Promise<Task | null> => {
    try {
      // First, add the new task
      const childId = await get().addTask(title, priority, expiryDate, parentId, tagIds);
      
      if (!childId) {
        throw new Error('Failed to create child task');
      }
      
      // Mark parent task if not already done
      await get().markTaskAsParent(parentId);
      
      // Fetch the created child task
      await get().fetchTasks();
      const childTask = get().tasks.find(task => task.id === childId);
      
      return childTask || null;
    } catch (error) {
      console.error('Error creating child task:', error);
      set({ error: 'Failed to create child task' });
      return null;
    }
  },
  
  // Safely update parent with child
  updateParentWithChild: async (parentId: string, childId: string): Promise<void> => {
    try {
      // Get current parent task
      const { data: parentTask, error: fetchError } = await supabase
        .from('tasks')
        .select('child_task_ids')
        .eq('id', parentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update child_task_ids array
      const updatedChildIds = [...(parentTask.child_task_ids || [])];
      if (!updatedChildIds.includes(childId)) {
        updatedChildIds.push(childId);
      }
      
      // Update parent task
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          child_task_ids: updatedChildIds,
          status: 'closed',
          closed_status: 'parent'
        })
        .eq('id', parentId);
        
      if (updateError) throw updateError;
      
      // Update local state
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === parentId 
            ? { 
                ...task, 
                child_task_ids: updatedChildIds,
                status: 'closed',
                closed_status: 'parent'
              }
            : task
        ),
      }));
    } catch (error) {
      console.error('Error updating parent with child:', error);
      set({ error: 'Failed to update parent with child' });
    }
  }
});
