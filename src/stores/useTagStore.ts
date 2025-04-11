
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { TagStore } from '@/types/tagStore';
import { toast } from '@/hooks/use-toast';
import {
  fetchTagsFromDb,
  createTagInDb,
  updateTagInDb,
  deleteTagFromDb,
  addTagToTaskInDb,
  removeTagFromTaskInDb
} from './actions/tagActions';

const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const tags = await fetchTagsFromDb(user.id);
      set({ tags, isLoading: false });
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

      const newTag = await createTagInDb(name, user.id);
      set(state => ({ tags: [...state.tags, newTag] }));
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      set({ error: 'Failed to create tag' });
      return null;
    }
  },

  deleteTag: async (id: string) => {
    try {
      await deleteTagFromDb(id);
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
      await updateTagInDb(id, name);
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
      await addTagToTaskInDb(taskId, tagId);
      // Refresh tags to ensure state is up to date
      await get().fetchTags();
      
      toast({
        title: "Tag added",
        description: "The tag has been added to the task",
      });
    } catch (error) {
      console.error('Error adding tag to task:', error);
      set({ error: 'Failed to add tag to task' });
    }
  },

  removeTagFromTask: async (taskId: string, tagId: string) => {
    try {
      await removeTagFromTaskInDb(taskId, tagId);
      // Refresh tags to ensure state is up to date
      await get().fetchTags();
      
      toast({
        title: "Tag removed",
        description: "The tag has been removed from the task",
      });
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
