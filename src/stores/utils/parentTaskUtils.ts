
import { Task } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates the parent task's expiry date to match the newest child task expiry date
 * @param parentId The ID of the parent task
 * @param childTasks Array of child tasks
 */
export const updateParentTaskExpiry = async (parentId: string, childTasks: Task[]): Promise<void> => {
  // If there are no child tasks, don't update anything
  if (!childTasks || childTasks.length === 0) return;

  // Find the newest expiry date among child tasks
  const newestExpiryDate = childTasks.reduce((latest, task) => {
    const taskExpiry = new Date(task.expiry_date);
    return taskExpiry > latest ? taskExpiry : latest;
  }, new Date(0)); // Start with oldest possible date for comparison

  try {
    // Update the parent task expiry date in the database
    const { error } = await supabase
      .from('tasks')
      .update({
        expiry_date: newestExpiryDate.toISOString(),
      })
      .eq('id', parentId);

    if (error) {
      console.error('Error updating parent task expiry date:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update parent task expiry date:', error);
    throw error;
  }
};

/**
 * Updates all parent tasks' expiry dates based on their child tasks
 * @param tasks Array of all tasks
 */
export const refreshAllParentTasksExpiry = async (tasks: Task[]): Promise<void> => {
  // Find all parent tasks
  const parentTasks = tasks.filter(task => 
    task.closed_status === 'parent' && task.child_task_ids && task.child_task_ids.length > 0
  );

  for (const parentTask of parentTasks) {
    // Get all child tasks for this parent
    const childTasks = tasks.filter(task => 
      parentTask.child_task_ids.includes(task.id)
    );

    // Update the parent's expiry date
    await updateParentTaskExpiry(parentTask.id, childTasks);
  }
};
