
import { supabase } from '@/integrations/supabase/client';
import { Priority } from '@/types/task';

export const addTaskToDB = async (
  title: string,
  priority: Priority,
  expiryDate: Date,
  ownerId: string,
  parentId?: string,
  tagIds: string[] = []
): Promise<string | null> => {
  // Create the new task with appropriate relationships
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      owner_id: ownerId,
      priority,
      expiry_date: expiryDate.toISOString(),
      parent_id: parentId || null,
      tags: tagIds,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding task to DB:', error);
    throw error;
  }
  
  return data?.id || null;
};
