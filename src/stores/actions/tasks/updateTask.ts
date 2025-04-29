import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';

export const updateTaskInDB = async (
  id: string,
  updates: { title?: string; priority?: Priority; tags?: string[] }
): Promise<void> => {
  // Get user subscription status first
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      plan_id,
      plans(can_edit_tasks)
    `)
    .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
    .single();

  const isPro = profile?.plans?.can_edit_tasks === true;

  // If the user is not Pro, remove tags from updates
  if (!isPro && updates.tags) {
    delete updates.tags;
  }

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  if (updates.tags && isPro) {
    await updateTaskTags(id, updates.tags);
  }
};

const updateTaskTags = async (taskId: string, newTags: string[]) => {
  const { data: currentRelations, error: fetchError } = await supabase
    .from('task_tags')
    .select('tag_id')
    .eq('task_id', taskId);
  
  if (fetchError) {
    console.error('Error fetching current task-tag relations:', fetchError);
    return;
  }
  
  const currentTagIds = currentRelations.map(rel => rel.tag_id);
  
  const tagsToAdd = newTags.filter(tagId => !currentTagIds.includes(tagId));
  const tagsToRemove = currentTagIds.filter(tagId => !newTags.includes(tagId));
  
  await Promise.all([
    addNewTaskTags(taskId, tagsToAdd),
    removeOldTaskTags(taskId, tagsToRemove)
  ]);
};

const addNewTaskTags = async (taskId: string, tagsToAdd: string[]) => {
  if (tagsToAdd.length === 0) return;
  
  const newRelations = tagsToAdd.map(tagId => ({
    task_id: taskId,
    tag_id: tagId
  }));
  
  const { error: addError } = await supabase
    .from('task_tags')
    .insert(newRelations);
    
  if (addError) console.error('Error adding new task-tag relations:', addError);
};

const removeOldTaskTags = async (taskId: string, tagsToRemove: string[]) => {
  for (const tagId of tagsToRemove) {
    const { error: deleteError } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId);
      
    if (deleteError) console.error('Error removing task-tag relation:', deleteError);
  }
};
