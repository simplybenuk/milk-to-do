
import { supabase } from '@/integrations/supabase/client';
import { Task, Priority, TaskStatus } from '@/types/task';
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
  return convertDatabaseDatesToDateObjects(data);
};

export const completeTaskInDB = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({
      status: 'closed',
      closed_status: 'complete',
      completed_at: new Date().toISOString(),
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
