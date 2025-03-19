
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
  parentId?: string
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
    tags: [],
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(newTask)
    .select()
    .single();

  if (error) throw error;
  
  // If this task has a parent, update the parent's child_task_ids array
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
  
  return convertDatabaseDatesToDateObjects(data);
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
