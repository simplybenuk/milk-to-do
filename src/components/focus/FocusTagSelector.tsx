
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag } from '@/types/tag';
import useTagStore from '@/stores/useTagStore';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
  const [selectAll, setSelectAll] = useState(true);

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
    if (selectAll && allTags.length > 0) {
      onTagsChange(allTags.map(tag => tag.id));
    }
  }, [allTags, selectAll, onTagsChange]);

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newSelectedTags);
    setSelectAll(newSelectedTags.length === allTags.length);
  };

  const handleSelectAll = () => {
    if (!selectAll || selectedTags.length < allTags.length) {
      onTagsChange(allTags.map(tag => tag.id));
      setSelectAll(true);
    } else {
      onTagsChange([]);
      setSelectAll(false);
    }
  };

  if (!allTags || allTags.length <= 1) {
    return null; // Don't show selector if there's only one or no tags
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Checkbox 
          id="select-all-tags" 
          checked={selectedTags.length === allTags.length} 
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all-tags" className="text-sm font-medium cursor-pointer">
          All Tags
        </Label>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge 
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-3 py-1",
              selectedTags.includes(tag.id) 
                ? "bg-milk-500 hover:bg-milk-600" 
                : "hover:bg-milk-100"
            )}
            onClick={() => handleTagToggle(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
