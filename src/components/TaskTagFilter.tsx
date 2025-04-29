
import { useEffect, useState } from 'react';
import { TagBadge } from '@/components/TagBadge';
import { Tag as TagIcon } from 'lucide-react';
import useTagStore from '@/stores/useTagStore';
import { useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export function TaskTagFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { tags, fetchTags } = useTagStore();
  const { isPro } = useSubscription();
  
  useEffect(() => {
    fetchTags();
    const tagParams = searchParams.get('tags');
    if (tagParams) {
      setSelectedTags(tagParams.split(','));
    }
  }, [fetchTags, searchParams]);
  
  useEffect(() => {
    if (selectedTags.length > 0) {
      searchParams.set('tags', selectedTags.join(','));
    } else {
      searchParams.delete('tags');
    }
    setSearchParams(searchParams);
  }, [selectedTags, searchParams, setSearchParams]);
  
  const handleTagClick = (tagId: string) => {
    if (!isPro) {
      toast.error("Tags are a Pro feature. Please upgrade to access this feature.");
      return;
    }
    
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  // Don't show the filter if there are no tags or if user is not Pro
  if (tags.length === 0) return null;
  
  return (
    <div className="mb-4 w-full">
      <div className="flex items-center gap-2 mb-3 w-full">
        <TagIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
        {!isPro && (
          <span className="text-xs text-muted-foreground italic">
            (Pro feature)
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 w-full">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            interactive={isPro}
            selected={selectedTags.includes(tag.id)}
            onClick={isPro ? () => handleTagClick(tag.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
