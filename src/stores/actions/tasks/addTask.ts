
import { supabase } from '@/integrations/supabase/client';
import { Priority, Task } from '@/types/task';
import { convertDatabaseDatesToDateObjects } from '../../utils/taskUtils';

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
    status: 'open',
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
    await updateParentChildIds(parentId, data.id);
  }
  
  if (tagIds && tagIds.length > 0) {
    await createTaskTagRelations(data.id, tagIds);
  }
  
  return convertDatabaseDatesToDateObjects(data);
};

const updateParentChildIds = async (parentId: string, newChildId: string) => {
  const { data: parentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('child_task_ids')
    .eq('id', parentId)
    .single();
    
  if (!fetchError && parentTask) {
    const updatedChildIds = [...(parentTask.child_task_ids || []), newChildId];
    
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ child_task_ids: updatedChildIds })
      .eq('id', parentId);
      
    if (updateError) console.error('Error updating parent task child_task_ids:', updateError);
  }
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
