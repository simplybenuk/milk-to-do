
import { useEffect, useState } from 'react';
import { TagBadge } from '@/components/TagBadge';
import useTagStore from '@/stores/useTagStore';
import { Tag } from '@/types/tag';

interface TaskTagsProps {
  taskId: string;
  tags: string[];
  onRemoveTag?: (tagId: string) => void;
  className?: string;
}

export function TaskTags({ taskId, tags = [], onRemoveTag, className = '' }: TaskTagsProps) {
  const [taskTags, setTaskTags] = useState<Tag[]>([]);
  const { tags: allTags, fetchTags } = useTagStore();
  
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  
  useEffect(() => {
    if (allTags.length > 0 && tags.length > 0) {
      const filteredTags = allTags.filter(tag => tags.includes(tag.id));
      setTaskTags(filteredTags);
    } else {
      setTaskTags([]);
    }
  }, [allTags, tags]);

  if (!taskTags.length) return null;
  
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {taskTags.map((tag) => (
        <TagBadge 
          key={tag.id} 
          name={tag.name} 
          onRemove={onRemoveTag ? () => onRemoveTag(tag.id) : undefined}
        />
      ))}
    </div>
  );
}
