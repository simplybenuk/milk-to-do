
import { create } from 'zustand';
import { TaskStore } from './types/taskStore.types';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchTasksFromDB,
  addTaskToDB,
  completeTaskInDB,
  deleteTaskFromDB,
  updateTaskPriorityInDB,
  incrementSkipCountInDB,
} from './actions/taskActions';
import { calculateTaskStats, sortTasksByPriority } from './utils/taskUtils';

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

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

  addTask: async (title, priority, expiryDate, parentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      await addTaskToDB(title, priority, expiryDate, user.id, parentId);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
    }
  },

  completeTask: async (id) => {
    try {
      await completeTaskInDB(id);
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
      await deleteTaskFromDB(id);
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
      await updateTaskPriorityInDB(id, priority);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },

  incrementSkipCount: async (id) => {
    try {
      await incrementSkipCountInDB(id);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error incrementing skip count:', error);
      set({ error: 'Failed to increment skip count' });
    }
  },

  getTasksByPriority: () => {
    return sortTasksByPriority(get().tasks);
  },

  getTaskStats: () => {
    return calculateTaskStats(get().tasks);
  },
}));

export default useTaskStore;
