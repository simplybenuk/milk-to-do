
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import useTagStore from '@/stores/useTagStore';
import { Tag } from '@/types/tag';

interface FocusTagInfoProps {
  selectedTagIds?: string[];
}

export function FocusTagInfo({ selectedTagIds }: FocusTagInfoProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { tags } = useTagStore();
  
  useEffect(() => {
    if (selectedTagIds && selectedTagIds.length > 0 && tags.length > 0) {
      const filteredTags = tags.filter(tag => selectedTagIds.includes(tag.id));
      setSelectedTags(filteredTags);
    } else {
      setSelectedTags([]);
    }
  }, [selectedTagIds, tags]);
  
  if (!selectedTagIds || selectedTagIds.length === 0 || selectedTags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 mb-4 justify-center">
      <span className="text-sm text-milk-600">Focusing on:</span>
      {selectedTags.map(tag => (
        <Badge 
          key={tag.id}
          variant="outline" 
          className="bg-muted text-muted-foreground border-border"
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
