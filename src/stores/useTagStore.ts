
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';

interface TagStore {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<Tag | null>;
  deleteTag: (id: string) => Promise<void>;
  updateTag: (id: string, name: string) => Promise<void>;
  addTagToTask: (taskId: string, tagId: string) => Promise<void>;
  removeTagFromTask: (taskId: string, tagId: string) => Promise<void>;
  getTagsForTask: (taskId: string) => Tag[];
}

const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      set({ tags: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching tags:', error);
      set({ error: 'Failed to fetch tags', isLoading: false });
    }
  },

  createTag: async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Check if tag already exists for this user
      const existingTags = get().tags;
      const existingTag = existingTags.find(tag => 
        tag.name.toLowerCase() === name.toLowerCase()
      );

      if (existingTag) {
        return existingTag;
      }

      const { data, error } = await supabase
        .from('tags')
        .insert({ name, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ tags: [...state.tags, data] }));
      return data;
    } catch (error) {
      console.error('Error creating tag:', error);
      set({ error: 'Failed to create tag' });
      return null;
    }
  },

  deleteTag: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        tags: state.tags.filter(tag => tag.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting tag:', error);
      set({ error: 'Failed to delete tag' });
    }
  },

  updateTag: async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ name })
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        tags: state.tags.map(tag =>
          tag.id === id ? { ...tag, name } : tag
        ),
      }));
    } catch (error) {
      console.error('Error updating tag:', error);
      set({ error: 'Failed to update tag' });
    }
  },

  addTagToTask: async (taskId: string, tagId: string) => {
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
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          tags: supabase.sql`array_append(tags, ${tagId})` 
        })
        .eq('id', taskId);

      if (updateError) throw updateError;
      
      // Refresh tags to ensure state is up to date
      await get().fetchTags();
    } catch (error) {
      console.error('Error adding tag to task:', error);
      set({ error: 'Failed to add tag to task' });
    }
  },

  removeTagFromTask: async (taskId: string, tagId: string) => {
    try {
      // Remove the relation from the task_tags table
      const { error } = await supabase
        .from('task_tags')
        .delete()
        .eq('task_id', taskId)
        .eq('tag_id', tagId);

      if (error) throw error;
      
      // Update the tasks table to remove the tag ID from its tags array
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          tags: supabase.sql`array_remove(tags, ${tagId})` 
        })
        .eq('id', taskId);

      if (updateError) throw updateError;
      
      // Refresh tags to ensure state is up to date
      await get().fetchTags();
    } catch (error) {
      console.error('Error removing tag from task:', error);
      set({ error: 'Failed to remove tag from task' });
    }
  },

  getTagsForTask: (taskId: string) => {
    const { tags } = get();
    // Find the task and return the tags that match its tag IDs
    const tasksWithTags = get().tags.filter(tag => 
      (tag as any).tasks?.includes(taskId)
    );
    return tasksWithTags;
  },
}));

export default useTagStore;
