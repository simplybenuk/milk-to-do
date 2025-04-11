
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { toast } from '@/hooks/use-toast';

export const fetchTagsFromDb = async (userId: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  
  // Convert the data to proper Tag objects
  return data.map(tag => ({
    id: tag.id,
    name: tag.name,
    user_id: tag.user_id,
    created_at: new Date(tag.created_at)
  }));
};

export const createTagInDb = async (name: string, userId: string): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  
  // Convert to Tag format
  return {
    id: data.id,
    name: data.name,
    user_id: data.user_id,
    created_at: new Date(data.created_at)
  };
};

export const updateTagInDb = async (id: string, name: string): Promise<void> => {
  const { error } = await supabase
    .from('tags')
    .update({ name })
    .eq('id', id);

  if (error) throw error;
};

export const deleteTagFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addTagToTaskInDb = async (taskId: string, tagId: string): Promise<void> => {
  try {
    // Check if the relation already exists
    const { data: existingRelation, error: checkError } = await supabase
      .from('task_tags')
      .select('*')
      .eq('task_id', taskId)
      .eq('tag_id', tagId)
      .maybeSingle();

    if (checkError) throw checkError;
    
    // If relation doesn't exist, create it
    if (!existingRelation) {
      const { error } = await supabase
        .from('task_tags')
        .insert({ task_id: taskId, tag_id: tagId });

      if (error) throw error;
    }
    
    // Update the tasks table to include the tag ID in its tags array
    // Use the RPC function to append the tag to the task
    const { error: rpcError } = await supabase.rpc(
      'append_tag_to_task' as any,
      { 
        p_task_id: taskId,
        p_tag_id: tagId
      }
    );

    if (rpcError) throw rpcError;
  } catch (error) {
    console.error('Error adding tag to task:', error);
    toast({
      title: "Error",
      description: "Failed to add tag to task",
      variant: "destructive",
    });
    throw error;
  }
};

export const removeTagFromTaskInDb = async (taskId: string, tagId: string): Promise<void> => {
  try {
    // Remove the relation from the task_tags table
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId);

    if (error) throw error;
    
    // Update the tasks table to remove the tag ID from its tags array
    // Use the RPC function to remove the tag from the task
    const { error: rpcError } = await supabase.rpc(
      'remove_tag_from_task' as any,
      { 
        p_task_id: taskId,
        p_tag_id: tagId
      }
    );

    if (rpcError) throw rpcError;
  } catch (error) {
    console.error('Error removing tag from task:', error);
    toast({
      title: "Error",
      description: "Failed to remove tag from task",
      variant: "destructive",
    });
    throw error;
  }
};
