
import { Tag } from './tag';

export interface TagStore {
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
