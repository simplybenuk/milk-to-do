
import { useEffect } from 'react';
import useTaskStore from '@/stores/useTaskStore';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing task data fetching
 */
export function useTaskDataFetching() {
  const { fetchTasks } = useTaskStore();
  const { toast } = useToast();
  
  const loadTasks = async () => {
    console.log('Fetching tasks...');
    try {
      await fetchTasks().catch(err => {
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
  };
  
  return { loadTasks };
}
