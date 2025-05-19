
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
      const childTask = get().tasks.find(task => task.id === childId);
      
      return childTask || null;
    } catch (error) {
      console.error('Error creating child task:', error);
      set({ error: 'Failed to create child task' });
      return null;
    }
  }
});
