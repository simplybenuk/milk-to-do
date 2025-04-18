import { useEffect, useState } from 'react';
import { TagBadge } from '@/components/TagBadge';
import { Tag as TagIcon } from 'lucide-react';
import useTagStore from '@/stores/useTagStore';
import { useSearchParams } from 'react-router-dom';

export function TaskTagFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { tags, fetchTags } = useTagStore();
  
  useEffect(() => {
    fetchTags();
    const tagParams = searchParams.get('tags');
    if (tagParams) {
      setSelectedTags(tagParams.split(','));
    }
  }, [fetchTags]);
  
  useEffect(() => {
    if (selectedTags.length > 0) {
      searchParams.set('tags', selectedTags.join(','));
    } else {
      searchParams.delete('tags');
    }
    setSearchParams(searchParams);
  }, [selectedTags, setSearchParams]);
  
  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            interactive
            selected={selectedTags.includes(tag.id)}
            onClick={() => handleTagClick(tag.id)}
          />
        ))}
      </div>
    </div>
  );
}
