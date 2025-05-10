
import { supabase } from '@/integrations/supabase/client';
import { Priority, Task, TaskStatus } from '@/types/task';
import { convertDatabaseDatesToDateObjects } from '../../utils/taskUtils';
import { updateParentTaskExpiry } from '../../utils/parentTaskUtils';

export const addTaskToDB = async (
  title: string,
  priority: Priority,
  expiryDate: Date,
  userId: string,
  parentId?: string,
  tagIds: string[] = []
): Promise<Task> => {
  const newTask = {
    title,
    priority,
    expiry_date: expiryDate.toISOString(),
    parent_id: parentId || null,
    status: 'open' as TaskStatus, // Explicitly type as TaskStatus
    owner_id: userId,
    skip_count: 0,
    child_task_ids: [],
    tags: tagIds,
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(newTask)
    .select()
    .single();

  if (error) throw error;
  
  if (parentId) {
    // Get parent task and its current child tasks
    const { data: parentData, error: parentError } = await supabase
      .from('tasks')
      .select('child_task_ids, status, closed_status')
      .eq('id', parentId)
      .single();
      
    if (!parentError && parentData) {
      const updatedChildIds = [...(parentData.child_task_ids || []), data.id];
      
      // Create update data object
      const updateData = { 
        child_task_ids: updatedChildIds 
      };
      
      // Only set closed_status if it's not already set
      // This prevents overriding existing valid values
      if (!parentData.closed_status) {
        // Update parent task with child IDs and mark as parent
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            child_task_ids: updatedChildIds,
            closed_status: 'parent'
          })
          .eq('id', parentId);
          
        if (updateError) {
          console.error('Error updating parent task child_task_ids:', updateError);
        }
      } else {
        // Only update the child_task_ids array
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ child_task_ids: updatedChildIds })
          .eq('id', parentId);
          
        if (updateError) {
          console.error('Error updating parent task child_task_ids:', updateError);
        }
      }
      
      // Get all child tasks for the parent to update its expiry date
      const { data: childTasks, error: childError } = await supabase
        .from('tasks')
        .select('*')
        .in('id', updatedChildIds);
      
      if (!childError && childTasks) {
        // Convert the database dates to JavaScript Date objects
        const formattedChildTasks = childTasks.map(convertDatabaseDatesToDateObjects);
        
        // Update parent task's expiry date based on newest child task
        await updateParentTaskExpiry(parentId, formattedChildTasks);
      }
    }
  }
  
  if (tagIds && tagIds.length > 0) {
    await createTaskTagRelations(data.id, tagIds);
  }
  
  return convertDatabaseDatesToDateObjects(data);
};

const createTaskTagRelations = async (taskId: string, tagIds: string[]) => {
  const taskTagRelations = tagIds.map(tagId => ({
    task_id: taskId,
    tag_id: tagId
  }));
  
  const { error: relationError } = await supabase
    .from('task_tags')
    .insert(taskTagRelations);
    
  if (relationError) console.error('Error creating task-tag relations:', relationError);
};
