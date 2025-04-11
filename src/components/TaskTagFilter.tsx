
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TagSelector } from '@/components/TagSelector';
import { TagBadge } from '@/components/TagBadge';
import { X, Tag as TagIcon } from 'lucide-react';
import useTagStore from '@/stores/useTagStore';
import { useSearchParams } from 'react-router-dom';

export function TaskTagFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
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
  
  const handleSelectTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  const handleDeselectTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };
  
  const clearAllTags = () => {
    setSelectedTags([]);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Filter by tags:</span>
        </div>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      
      <TagSelector
        selectedTags={selectedTags}
        onSelectTag={handleSelectTag}
        onDeselectTag={handleDeselectTag}
        placeholder="Filter by tags..."
        isFilterMode={true}
      />
    </div>
  );
}
