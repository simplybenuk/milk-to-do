
import { Task, Priority } from '@/types/task';
import { TaskStoreState } from '../../types/taskStoreState.types';
import { 
  addTaskToDB, 
  updateTaskInDB, 
  completeTaskInDB,
  deleteTaskFromDB,
  fetchTasksFromDB 
} from '../taskActions';
import { supabase } from '@/integrations/supabase/client';

export const getCoreTaskActions = (
  tasks: Task[],
  setState: (newState: Partial<TaskStoreState>) => void,
  set: (fn: (state: { tasks: Task[] }) => { tasks: Task[] }) => void,
  get: () => { fetchTasks: () => Promise<void> }
) => ({
  fetchTasks: async () => {
    setState({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const tasks = await fetchTasksFromDB(user.id);
      setState({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setState({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (title: string, priority: Priority, expiryDate: Date, parentId?: string, tagIds: string[] = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      await addTaskToDB(title, priority, expiryDate, user.id, parentId, tagIds);
      await get().fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      setState({ error: 'Failed to add task' });
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
      setState({ error: 'Failed to edit task' });
    }
  },

  completeTask: async (id: string, reason = 'complete') => {
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
      setState({ error: 'Failed to complete task' });
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
      setState({ error: 'Failed to delete task' });
    }
  }
});
