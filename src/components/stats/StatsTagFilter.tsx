import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import useTagStore from '@/stores/useTagStore';
import { Tag } from '@/types/tag';
import { CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTagFilterProps {
  onTagsChange: (tagIds: string[] | undefined) => void;
}

export function StatsTagFilter({ onTagsChange }: StatsTagFilterProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const { tags, fetchTags } = useTagStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    if (tags && tags.length > 0) {
      setAllTags(tags);
      
      // If all is selected, set all tag IDs
      if (isAllSelected) {
        const allTagIds = tags.map(tag => tag.id);
        setSelectedTags(allTagIds);
        onTagsChange(undefined); // undefined means all tags
      }
    }
  }, [tags, isAllSelected, onTagsChange]);

  const handleTagToggle = (tagId: string) => {
    // If "All Tags" is currently selected, deselect it and only select the clicked tag
    if (isAllSelected || selectedTags.length === allTags.length) {
      const newSelectedTags = [tagId];
      setSelectedTags(newSelectedTags);
      setIsAllSelected(false);
      onTagsChange(newSelectedTags);
      return;
    }
    
    // Otherwise toggle as normal
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
    
    // Update All Tags state if all tags are selected again
    setIsAllSelected(newSelectedTags.length === allTags.length);
    if (newSelectedTags.length === allTags.length) {
      onTagsChange(undefined); // undefined means all tags
    }
  };

  const handleSelectAll = () => {
    if (!isAllSelected) {
      setSelectedTags(allTags.map(tag => tag.id));
      setIsAllSelected(true);
      onTagsChange(undefined); // undefined means all tags
    } else {
      setSelectedTags([]);
      setIsAllSelected(false);
      onTagsChange([]);
    }
  };

  if (!allTags || allTags.length === 0) {
    return null; // Don't show filter if there are no tags
  }

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-sm font-medium">Filter by tags:</h3>
      
      <div className="flex items-center gap-2 mb-2">
        <Badge 
          variant={isAllSelected ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1.5",
            isAllSelected
              ? "bg-secondary hover:bg-secondary/80"
              : "hover:bg-muted"
          )}
          onClick={handleSelectAll}
        >
          {isAllSelected && (
            <CircleCheck className="h-4 w-4 mr-1" />
          )}
          All Tags
        </Badge>
        <span className="text-xs text-muted-foreground">(Default)</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge 
            key={tag.id}
            variant={selectedTags.includes(tag.id) && !isAllSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              selectedTags.includes(tag.id) && !isAllSelected
                ? "bg-secondary hover:bg-secondary/80"
                : "hover:bg-muted"
            )}
            onClick={() => handleTagToggle(tag.id)}
          >
            {selectedTags.includes(tag.id) && !isAllSelected && (
              <CircleCheck className="h-4 w-4 mr-1" />
            )}
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
