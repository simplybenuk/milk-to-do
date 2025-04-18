
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TagSelector } from '@/components/TagSelector';
import { TagBadge } from '@/components/TagBadge';
import { Plus, Tag as TagIcon } from 'lucide-react';
import useTagStore from '@/stores/useTagStore';
import { useSearchParams } from 'react-router-dom';

export function TaskTagFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const { tags, fetchTags } = useTagStore();
  
  // Initialize selected tags from URL params on component mount
  useEffect(() => {
    fetchTags();
    const tagParams = searchParams.get('tags');
    if (tagParams) {
      setSelectedTags(tagParams.split(','));
    }
  }, [fetchTags]);
  
  // Update URL when selected tags change
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
        {tags.length === 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTagSelector(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create filter
          </Button>
        ) : (
          <>
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                interactive
                selected={selectedTags.includes(tag.id)}
                onClick={() => handleTagClick(tag.id)}
              />
            ))}
          </>
        )}
      </div>
      
      {showTagSelector && (
        <div className="mt-4">
          <TagSelector
            selectedTags={selectedTags}
            onSelectTag={(tagId) => {
              setSelectedTags([...selectedTags, tagId]);
              setShowTagSelector(false);
            }}
            onDeselectTag={(tagId) => setSelectedTags(selectedTags.filter(id => id !== tagId))}
            placeholder="Create new filter..."
            isFilterMode={true}
          />
        </div>
      )}
    </div>
  );
}
