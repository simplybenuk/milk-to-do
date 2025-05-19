
import { useState, useEffect, useCallback } from 'react';
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

  // Update available tags when store changes
  useEffect(() => {
    if (tags && tags.length > 0) {
      setAllTags(tags);
    }
  }, [tags]);

  // Handle "All Tags" selection changes
  useEffect(() => {
    if (isAllSelected && allTags.length > 0) {
      // Only update when necessary to avoid loops
      if (selectedTags.length !== allTags.length) {
        const allTagIds = allTags.map(tag => tag.id);
        setSelectedTags(allTagIds);
        onTagsChange(undefined); // undefined means all tags
      }
    }
  }, [isAllSelected, allTags, selectedTags.length, onTagsChange]);

  const handleTagToggle = useCallback((tagId: string) => {
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
  }, [selectedTags, isAllSelected, allTags, onTagsChange]);

  const handleSelectAll = useCallback(() => {
    if (!isAllSelected) {
      setSelectedTags(allTags.map(tag => tag.id));
      setIsAllSelected(true);
      onTagsChange(undefined); // undefined means all tags
    } else {
      setSelectedTags([]);
      setIsAllSelected(false);
      onTagsChange([]);
    }
  }, [isAllSelected, allTags, onTagsChange]);

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
              ? "bg-milk-500 hover:bg-milk-600" 
              : "hover:bg-milk-100"
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
                ? "bg-milk-500 hover:bg-milk-600" 
                : "hover:bg-milk-100"
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
