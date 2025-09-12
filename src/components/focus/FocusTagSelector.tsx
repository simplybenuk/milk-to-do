import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag } from '@/types/tag';
import useTagStore from '@/stores/useTagStore';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface FocusTagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  className?: string;
}

export function FocusTagSelector({ 
  selectedTags, 
  onTagsChange,
  className 
}: FocusTagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const { tags, fetchTags } = useTagStore();
  const [isAllSelected, setIsAllSelected] = useState(true);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    if (tags && tags.length > 0) {
      setAllTags(tags);
    }
  }, [tags]);

  useEffect(() => {
    // Initialize with all tags selected
    if (isAllSelected && allTags.length > 0) {
      onTagsChange(allTags.map(tag => tag.id));
    }
  }, [allTags, isAllSelected, onTagsChange]);

  const handleTagToggle = (tagId: string) => {
    // If "All Tags" is currently selected, deselect it and only select the clicked tag
    if (isAllSelected || selectedTags.length === allTags.length) {
      onTagsChange([tagId]);
      setIsAllSelected(false);
      return;
    }
    
    // Otherwise toggle as normal
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newSelectedTags);
    
    // Update All Tags state
    setIsAllSelected(newSelectedTags.length === allTags.length);
  };

  const handleSelectAll = () => {
    if (!isAllSelected) {
      onTagsChange(allTags.map(tag => tag.id));
      setIsAllSelected(true);
    } else {
      onTagsChange([]);
      setIsAllSelected(false);
    }
  };

  if (!allTags || allTags.length <= 1) {
    return null; // Don't show selector if there's only one or no tags
  }

  return (
    <div className={cn("space-y-4", className)}>
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
