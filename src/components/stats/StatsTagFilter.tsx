import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import useTagStore from '@/stores/useTagStore';
import { Tag } from '@/types/tag';
import { CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTagFilterProps {
  onSelectionChange: (tagIds: string[]) => void;
  selectedTagIds: string[];
}

export function StatsTagFilter({ onSelectionChange, selectedTagIds }: StatsTagFilterProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
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
        onSelectionChange(allTagIds);
      }
    }
  }, [tags, isAllSelected, onSelectionChange]);

  const handleTagToggle = (tagId: string) => {
    // If "All Tags" is currently selected, deselect it and only select the clicked tag
    if (isAllSelected || selectedTagIds.length === allTags.length) {
      const newSelectedTags = [tagId];
      setIsAllSelected(false);
      onSelectionChange(newSelectedTags);
      return;
    }
    
    // Otherwise toggle as normal
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    onSelectionChange(newSelectedTags);
    
    // Update All Tags state if all tags are selected again
    setIsAllSelected(newSelectedTags.length === allTags.length);
  };

  const handleSelectAll = () => {
    if (!isAllSelected) {
      const allTagIds = allTags.map(tag => tag.id);
      setIsAllSelected(true);
      onSelectionChange(allTagIds);
    } else {
      setIsAllSelected(false);
      onSelectionChange([]);
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
            variant={selectedTagIds.includes(tag.id) && !isAllSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              selectedTagIds.includes(tag.id) && !isAllSelected
                ? "bg-milk-500 hover:bg-milk-600" 
                : "hover:bg-milk-100"
            )}
            onClick={() => handleTagToggle(tag.id)}
          >
            {selectedTagIds.includes(tag.id) && !isAllSelected && (
              <CircleCheck className="h-4 w-4 mr-1" />
            )}
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
