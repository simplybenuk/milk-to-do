import { create } from 'zustand';
import { Task, Priority, TaskStatus, ClosedStatusReason } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: Priority, expiryDate: Date, parentId?: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskPriority: (id: string, priority: Priority) => Promise<void>;
  incrementSkipCount: (id: string) => Promise<void>;
  getTasksByPriority: () => Task[];
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tasks = data.map(task => ({
        ...task,
        created_at: new Date(task.created_at),
        expiry_date: new Date(task.expiry_date),
      }));

      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (title, priority, expiryDate, parentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          title,
          priority,
          expiry_date: expiryDate.toISOString(),
          parent_id: parentId,
          status: 'open' as TaskStatus,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const task: Task = {
        ...newTask,
        created_at: new Date(newTask.created_at),
        expiry_date: new Date(newTask.expiry_date),
        child_task_ids: newTask.child_task_ids || [],
        tags: newTask.tags || [],
      };

      set(state => ({ tasks: [task, ...state.tasks] }));
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
    }
  },

  completeTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'closed',
          closed_status: 'complete',
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, status: 'closed', closed_status: 'complete' }
            : task
        ),
      }));
    } catch (error) {
      console.error('Error completing task:', error);
      set({ error: 'Failed to complete task' });
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task' });
    }
  },

  updateTaskPriority: async (id, priority) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ priority })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, priority } : task
        ),
      }));
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },

  incrementSkipCount: async (id) => {
    try {
      const { data: newCount, error: rpcError } = await supabase
        .rpc('increment', { row_id: id });

      if (rpcError) throw rpcError;

      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id ? { ...task, skip_count: newCount } : task
        ),
      }));
    } catch (error) {
      console.error('Error incrementing skip count:', error);
      set({ error: 'Failed to increment skip count' });
    }
  },

  getTasksByPriority: () => {
    const { tasks } = get();
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'closed' ? 1 : -1;
      
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      const aTimeLeft = a.expiry_date.getTime() - Date.now();
      const bTimeLeft = b.expiry_date.getTime() - Date.now();
      return aTimeLeft - bTimeLeft;
    });
  },
}));

export default useTaskStore;
