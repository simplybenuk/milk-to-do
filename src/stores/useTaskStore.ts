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
  getTaskStats: () => { 
    completedLastWeek: Task[],
    completedLastMonth: Task[],
    expired: Task[]
  };
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
        .eq('owner_id', user.id)
        .order('priority_score', { ascending: false });

      if (error) throw error;

      const tasks = data.map(task => ({
        ...task,
        created_at: new Date(task.created_at),
        expiry_date: new Date(task.expiry_date),
        child_task_ids: task.child_task_ids || [],
        tags: task.tags || [],
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

      const newTask = {
        title,
        priority,
        expiry_date: expiryDate.toISOString(),
        parent_id: parentId || null,
        status: 'open' as TaskStatus,
        owner_id: user.id,
        skip_count: 0,
        child_task_ids: [],
        tags: [],
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      const task: Task = {
        ...data,
        created_at: new Date(data.created_at),
        expiry_date: new Date(data.expiry_date),
        child_task_ids: data.child_task_ids || [],
        tags: data.tags || [],
      };

      await get().fetchTasks();
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
          completed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { 
                ...task, 
                status: 'closed', 
                closed_status: 'complete',
                completed_at: new Date()
              }
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

      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },

  incrementSkipCount: async (id) => {
    try {
      const { error: rpcError } = await supabase
        .rpc('increment', { row_id: id });

      if (rpcError) throw rpcError;

      await get().fetchTasks();
    } catch (error) {
      console.error('Error incrementing skip count:', error);
      set({ error: 'Failed to increment skip count' });
    }
  },

  getTasksByPriority: () => {
    const { tasks } = get();
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'closed' ? 1 : -1;
      return b.priority_score - a.priority_score;
    });
  },

  getTaskStats: () => {
    const { tasks } = get();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      completedLastWeek: tasks.filter(task => 
        task.completed_at && 
        task.completed_at >= oneWeekAgo
      ),
      completedLastMonth: tasks.filter(task => 
        task.completed_at && 
        task.completed_at >= oneMonthAgo
      ),
      expired: tasks.filter(task => 
        task.expired_at !== null
      ),
    };
  },
}));

export default useTaskStore;
