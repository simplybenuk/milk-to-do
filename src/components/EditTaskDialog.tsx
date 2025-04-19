
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Priority, Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { Tag as TagIcon, Plus } from 'lucide-react';  // Added Plus import here
import { TagBadge } from '@/components/TagBadge';
import useTagStore from '@/stores/useTagStore';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string, title: string, priority: Priority, tagIds?: string[]) => Promise<void>;
}

export function EditTaskDialog({ task, open, onOpenChange, onEdit }: EditTaskDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { tags, fetchTags, createTag } = useTagStore();
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingNewTag, setIsCreatingNewTag] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Reset form and selected priority when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setSelectedTags(task.tags || []);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;
    
    try {
      await onEdit(task.id, title.trim(), priority, selectedTags);
      onOpenChange(false);
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Failed to update task',
        description: 'There was an error updating your task.',
        variant: 'destructive',
      });
    }
  };

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleCreateNewTag = async () => {
    if (!newTagName.trim()) return;
    
    const newTag = await createTag(newTagName.trim());
    if (newTag) {
      setSelectedTags([...selectedTags, newTag.id]);
      setNewTagName('');
      setIsCreatingNewTag(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-slide-up sm:max-w-[425px] pb-6">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <textarea
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <Button
                key={p}
                type="button"
                variant={priority === p ? "default" : "outline"}
                onClick={() => setPriority(p)}
                className="flex-1 capitalize"
              >
                {p}
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  interactive
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => handleTagClick(tag.id)}
                  onRemove={
                    selectedTags.includes(tag.id)
                      ? () => setSelectedTags(selectedTags.filter(id => id !== tag.id))
                      : undefined
                  }
                />
              ))}
              {!isCreatingNewTag ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 opacity-70 hover:opacity-100"
                  onClick={() => setIsCreatingNewTag(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New tag
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateNewTag()}
                    placeholder="Tag name" 
                    className="border rounded px-2 py-1 text-sm w-32"
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleCreateNewTag}
                    disabled={!newTagName.trim()}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
