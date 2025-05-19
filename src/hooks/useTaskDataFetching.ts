
import { useEffect, useCallback } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';
import { FetchTasksOptions } from '@/stores/actions/tasks/fetchTasks';

/**
 * Hook for managing task data fetching with pagination and filtering
 */
export function useTaskDataFetching() {
  const { fetchTasks, fetchTasksByView } = useTaskStore();
  const { toast } = useToast();
  
  const loadTasks = useCallback(async (options?: FetchTasksOptions) => {
    console.log('Fetching tasks with options:', options);
    try {
      await fetchTasks(options).catch(err => {
        console.error('Error fetching tasks:', err);
        toast({
          title: 'Error fetching tasks',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
      });
    } catch (err) {
      console.error('Exception in fetchTasks:', err);
    }
  }, [fetchTasks, toast]);
  
  const loadTasksByView = useCallback(async (viewName: string) => {
    console.log(`Loading tasks for view: ${viewName}`);
    try {
      await fetchTasksByView(viewName).catch(err => {
        console.error(`Error fetching tasks for view ${viewName}:`, err);
        toast({
          title: 'Error fetching tasks',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
      });
    } catch (err) {
      console.error('Exception in fetchTasksByView:', err);
    }
  }, [fetchTasksByView, toast]);

  return { 
    loadTasks,
    loadTasksByView
  };
}
