
import { useState, useRef, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus, Tag as TagIcon } from 'lucide-react';
import { TagBadge } from './TagBadge';
import useTagStore from '@/stores/useTagStore';
import { Tag } from '@/types/tag';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  selectedTags: string[];
  onSelectTag: (tagId: string) => void;
  onDeselectTag: (tagId: string) => void;
  placeholder?: string;
  taskId?: string;
  isFilterMode?: boolean;
}

export function TagSelector({ 
  selectedTags, 
  onSelectTag, 
  onDeselectTag, 
  placeholder = "Select tags...", 
  taskId,
  isFilterMode = false
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { tags, createTag, fetchTags, isLoading } = useTagStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return;
    
    const newTag = await createTag(inputValue.trim());
    if (newTag && taskId) {
      onSelectTag(newTag.id);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      handleCreateTag();
    }
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[30px]">
        {selectedTagObjects.map((tag) => (
          <TagBadge 
            key={tag.id} 
            name={tag.name} 
            onRemove={() => onDeselectTag(tag.id)}
          />
        ))}
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 opacity-50" />
              <span>{placeholder}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search or create a tag..." 
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            
            {inputValue && !tags.some(tag => 
              tag.name.toLowerCase() === inputValue.toLowerCase()
            ) && (
              <CommandItem 
                onSelect={handleCreateTag}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create "{inputValue}"</span>
              </CommandItem>
            )}
            
            <CommandEmpty>No tags found.</CommandEmpty>
            
            <CommandGroup heading="Available Tags">
              <CommandList>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => {
                        if (isSelected) {
                          onDeselectTag(tag.id);
                        } else {
                          onSelectTag(tag.id);
                        }
                        if (!isFilterMode) {
                          setOpen(false);
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span>{tag.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
