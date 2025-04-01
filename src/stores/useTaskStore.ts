
import { create } from 'zustand';
import { TaskStore, UserSubscription } from './types/taskStore.types';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchTasksFromDB,
  addTaskToDB,
  completeTaskInDB,
  deleteTaskFromDB,
  updateTaskPriorityInDB,
  incrementSkipCountInDB,
  updateTaskInDB,
} from './actions/taskActions';
import { calculateTaskStats, sortTasksByPriority } from './utils/taskUtils';
import { ClosedStatusReason, Priority } from '@/types/task';

// Initialize with current user session if available
let initialUserId: string | undefined = undefined;
try {
  const session = JSON.parse(localStorage.getItem('sb-vtkjlrftizocaqhbsyts-auth-token') || '{}');
  initialUserId = session?.user?.id;
  console.log('Initial userId from session:', initialUserId);
} catch (error) {
  console.error('Failed to parse session from localStorage:', error);
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  // Initialize with the user ID from local storage if available
  userId: initialUserId,

  // Initialize userSubscription with default free tier
  userSubscription: {
    tier: 'free',
    expiresAt: null,
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Set the userId in the store
      set({ userId: user.id });
      console.log('TaskStore: userId set to', user.id);
      
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

  editTask: async (id, title, priority) => {
    try {
      await updateTaskInDB(id, { title, priority });
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, title, priority }
            : task
        ),
      }));
      // Fetch tasks to get updated priority score calculation
      await get().fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
      set({ error: 'Failed to edit task' });
    }
  },

  completeTask: async (id, reason = 'complete' as ClosedStatusReason) => {
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
      // Update the local state immediately to avoid UI jumps
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, priority }
            : task
        ),
      }));
      // Then fetch the full updated list (which will include recalculated priority scores)
      await get().fetchTasks();
    } catch (error) {
      console.error('Error updating task priority:', error);
      set({ error: 'Failed to update task priority' });
    }
  },

  incrementSkipCount: async (id) => {
    try {
      await incrementSkipCountInDB(id);
      // Update local state to show the skip immediately
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, skip_count: task.skip_count + 1 }
            : task
        ),
      }));
      // Then fetch full task list for accurate priority scores
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
  
  setUserSubscription: (subscription: UserSubscription) => {
    set({ userSubscription: subscription });
  },
  
  hasProAccess: () => {
    const { userSubscription } = get();
    
    // If the user is on the pro tier
    if (userSubscription.tier === 'pro') {
      // If there's an expiry date, check if it's in the future
      if (userSubscription.expiresAt) {
        return new Date(userSubscription.expiresAt) > new Date();
      }
      // If no expiry date, they have indefinite pro access
      return true;
    }
    
    // Default to no pro access
    return false;
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ 
        tasks: [],
        userId: undefined,
        userSubscription: {
          tier: 'free',
          expiresAt: null,
        }
      });
      return Promise.resolve();
    } catch (error) {
      console.error('Error logging out:', error);
      return Promise.reject(error);
    }
  }
}));

// Initialize user ID on app load
const initializeUserId = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      useTaskStore.setState({ userId: session.user.id });
      console.log('TaskStore: initialized userId from session:', session.user.id);
    }
  } catch (error) {
    console.error('Error initializing userId:', error);
  }
};

// Run this immediately
initializeUserId();

export default useTaskStore;
