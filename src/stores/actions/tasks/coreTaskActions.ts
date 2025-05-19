
import { StateCreator } from 'zustand';
import { Task, Priority, ClosedStatusReason } from '@/types/task';
import { TaskStore } from '../../types/taskStore.types';
import { fetchTasksFromDB, FetchTasksOptions } from './fetchTasks';
import { supabase } from '@/integrations/supabase/client';

export const getCoreTaskActions = (
  set: StateCreator<TaskStore>['setState'],
  get: () => TaskStore
) => {
  return {
    fetchTasks: async (options?: FetchTasksOptions): Promise<Task[]> => {
      set({ isLoading: true, error: null });
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Use the new paginated fetch function
        const { tasks, count } = await fetchTasksFromDB(user.id, options);
        
        // If this is the first page or no pagination, replace the tasks
        // Otherwise we might want to append instead for infinite loading
        if (!options?.page || options.page === 0) {
          set({ 
            tasks, 
            isLoading: false,
            totalTaskCount: count
          });
        } else {
          // For subsequent pages, append new tasks to existing ones
          // This is useful for infinite loading patterns
          const currentTasks = get().tasks;
          set({ 
            tasks: [...currentTasks, ...tasks],
            isLoading: false,
            totalTaskCount: count
          });
        }
        
        return tasks;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        set({ isLoading: false, error: String(error) });
        return [];
      }
    },
    
    fetchTasksByView: async (viewName: string): Promise<Task[]> => {
      set({ isLoading: true, error: null });
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        let options: FetchTasksOptions = {};
        
        // Configure options based on the current view
        switch(viewName) {
          case 'all':
            options = { status: 'open', limit: 50 };
            break;
          case 'closed':
            options = { status: 'closed', limit: 20 };
            break;
          case 'focus':
            // For focus mode, we want open tasks sorted by priority
            options = { status: 'open' };
            break;
          default:
            options = { limit: 50 };
        }
        
        const { tasks } = await fetchTasksFromDB(user.id, options);
        
        set({ 
          tasks,
          isLoading: false 
        });
        
        return tasks;
      } catch (error) {
        console.error(`Error fetching tasks for view ${viewName}:`, error);
        set({ isLoading: false, error: String(error) });
        return [];
      }
    },
    
    addTask: async (title: string, priority: Priority, expiryDate: Date, parentId?: string, tagIds: string[] = []): Promise<string | null> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        // Add the task to the database
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title,
            priority,
            expiry_date: expiryDate.toISOString(),
            owner_id: user.id,
            parent_id: parentId || null,
            tags: tagIds,
            status: 'open',
            skip_count: 0,
            child_task_ids: []
          })
          .select('id')
          .single();
          
        if (error) throw error;
        const newTaskId = data.id;
        
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
        
        // Return the new task ID
        return newTaskId;
      } catch (error) {
        console.error('Error adding task:', error);
        set({ error: 'Failed to add task' });
        return null;
      }
    },
    
    editTask: async (id: string, title: string, priority: Priority, tagIds?: string[]) => {
      try {
        // Update the task in the database
        const { error } = await supabase
          .from('tasks')
          .update({ 
            title, 
            priority,
            tags: tagIds || [] 
          })
          .eq('id', id);
          
        if (error) throw error;
        
        // Update the local state
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, title, priority, tags: tagIds || task.tags }
              : task
          ),
        }));
        
        // Check if this is a parent task
        const task = get().tasks.find(t => t.id === id);
        
        // If it's a parent task and has child tasks, sync the tags
        if (task?.child_task_ids?.length > 0 && tagIds) {
          // Helper function to sync tags
          const syncTagsToChildTasks = async (parentId: string, tagIds: string[]) => {
            const children = get().tasks.filter(task => task.parent_id === parentId);
            
            for (const child of children) {
              await supabase
                .from('tasks')
                .update({ tags: tagIds })
                .eq('id', child.id);
            }
          };
          
          await syncTagsToChildTasks(id, tagIds);
        }
        
        // Refresh tasks to get the updated state
        await get().fetchTasks();
      } catch (error) {
        console.error('Error editing task:', error);
        set({ error: 'Failed to edit task' });
      }
    },
    
    completeTask: async (id: string, reason: ClosedStatusReason = 'complete') => {
      try {
        // Update the task in the database to mark it as complete
        const { error } = await supabase
          .from('tasks')
          .update({
            status: 'closed',
            closed_status: reason,
            completed_at: reason === 'complete' ? new Date().toISOString() : null
          })
          .eq('id', id);
          
        if (error) throw error;
        
        // Update the local state
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
        // Delete the task from the database
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update the local state
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id),
        }));
      } catch (error) {
        console.error('Error deleting task:', error);
        set({ error: 'Failed to delete task' });
      }
    },
    
    updateTask: async (id: string, updates: Partial<Task>) => {
      try {
        // Update the task in the database
        const { error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id);
          
        if (error) throw error;
        
        // Update the local state
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      } catch (error) {
        console.error('Error updating task:', error);
        set({ error: 'Failed to update task' });
      }
    },
    
    updateParentWithChild: async (parentId: string, childId: string) => {
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
  };
};
