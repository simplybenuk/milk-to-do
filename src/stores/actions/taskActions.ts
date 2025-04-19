import { supabase } from '@/integrations/supabase/client';
import { Task, Priority, TaskStatus, ClosedStatusReason } from '@/types/task';
import { convertDatabaseDatesToDateObjects } from '../utils/taskUtils';

export const fetchTasksFromDB = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('owner_id', userId)
    .order('priority_score', { ascending: false });

  if (error) throw error;
  return data.map(convertDatabaseDatesToDateObjects);
};

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
    status: 'open' as TaskStatus,
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
    const { data: parentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('child_task_ids')
      .eq('id', parentId)
      .single();
      
    if (!fetchError && parentTask) {
      const updatedChildIds = [...(parentTask.child_task_ids || []), data.id];
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ child_task_ids: updatedChildIds })
        .eq('id', parentId);
        
      if (updateError) console.error('Error updating parent task child_task_ids:', updateError);
    }
  }
  
  if (tagIds && tagIds.length > 0) {
    const taskTagRelations = tagIds.map(tagId => ({
      task_id: data.id,
      tag_id: tagId
    }));
    
    const { error: relationError } = await supabase
      .from('task_tags')
      .insert(taskTagRelations);
      
    if (relationError) console.error('Error creating task-tag relations:', relationError);
  }
  
  return convertDatabaseDatesToDateObjects(data);
};

export const updateTaskInDB = async (
  id: string,
  updates: { title?: string; priority?: Priority; tags?: string[] }
): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  if (updates.tags) {
    const { data: currentRelations, error: fetchError } = await supabase
      .from('task_tags')
      .select('tag_id')
      .eq('task_id', id);
    
    if (fetchError) {
      console.error('Error fetching current task-tag relations:', fetchError);
      return;
    }
    
    const currentTagIds = currentRelations.map(rel => rel.tag_id);
    const newTagIds = updates.tags || [];
    
    const tagsToAdd = newTagIds.filter(tagId => !currentTagIds.includes(tagId));
    const tagsToRemove = currentTagIds.filter(tagId => !newTagIds.includes(tagId));
    
    if (tagsToAdd.length > 0) {
      const newRelations = tagsToAdd.map(tagId => ({
        task_id: id,
        tag_id: tagId
      }));
      
      const { error: addError } = await supabase
        .from('task_tags')
        .insert(newRelations);
        
      if (addError) console.error('Error adding new task-tag relations:', addError);
    }
    
    if (tagsToRemove.length > 0) {
      for (const tagId of tagsToRemove) {
        const { error: deleteError } = await supabase
          .from('task_tags')
          .delete()
          .eq('task_id', id)
          .eq('tag_id', tagId);
          
        if (deleteError) console.error('Error removing task-tag relation:', deleteError);
      }
    }
  }
};

export const completeTaskInDB = async (id: string, reason: ClosedStatusReason = 'complete'): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'closed',
      closed_status: reason,
      completed_at: reason === 'complete' ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteTaskFromDB = async (id: string): Promise<void> => {
  const { error: tagsError } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', id);

  if (tagsError) console.error('Error deleting task-tag relations:', tagsError);
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateTaskPriorityInDB = async (id: string, priority: Priority): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', id);

  if (error) throw error;
};

export const incrementSkipCountInDB = async (id: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment', { row_id: id });

  if (error) throw error;
};

export const updateLastSkippedSessionInDB = async (id: string, sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ last_skipped_session: sessionId })
    .eq('id', id);

  if (error) throw error;
};

export const decaySkipCountsInDB = async (userId: string): Promise<void> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, skip_count')
    .eq('owner_id', userId);

  if (error) throw error;
  
  for (const task of data) {
    if (task.skip_count > 0) {
      const newSkipCount = Math.floor(task.skip_count / 2);
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ skip_count: newSkipCount })
        .eq('id', task.id);
        
      if (updateError) {
        console.error('Error decaying skip count for task:', task.id, updateError);
      }
    }
  }
};
