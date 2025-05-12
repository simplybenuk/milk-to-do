
import { supabase } from '@/integrations/supabase/client';

/**
 * Synchronizes tags between a parent task and all its child tasks
 * @param parentId - ID of the parent task
 * @param tagIds - Array of tag IDs to set on all child tasks
 * @returns Promise that resolves when all child tasks have been updated
 */
export const syncTagsToChildTasks = async (parentId: string, tagIds: string[]): Promise<void> => {
  try {
    // 1. Get the parent task to find all child task IDs
    const { data: parentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('child_task_ids')
      .eq('id', parentId)
      .single();

    if (fetchError) {
      console.error('Error fetching parent task for tag sync:', fetchError);
      throw fetchError;
    }

    if (!parentTask?.child_task_ids?.length) {
      // No child tasks to sync
      return;
    }

    // 2. Update all child tasks with the parent's tags
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ tags: tagIds })
      .in('id', parentTask.child_task_ids);

    if (updateError) {
      console.error('Error synchronizing tags to child tasks:', updateError);
      throw updateError;
    }

    console.log(`Successfully synchronized tags for ${parentTask.child_task_ids.length} child tasks`);
  } catch (error) {
    console.error('Tag synchronization failed:', error);
    throw error;
  }
};
