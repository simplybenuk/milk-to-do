import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Priority } from '@/types/task';
import { Plus, Tag as TagIcon } from 'lucide-react';
import { TagBadge } from '@/components/TagBadge';
import useTagStore from '@/stores/useTagStore';

interface AddTaskDialogProps {
  onAddTask: (title: string, priority: Priority, expiryDate: Date, tagIds?: string[]) => void;
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { tags, fetchTags, createTag } = useTagStore();
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingNewTag, setIsCreatingNewTag] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    onAddTask(title.trim(), priority, expiryDate, selectedTags);
    setTitle("");
    setPriority("medium");
    setSelectedTags([]);
    setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="animate-slide-up sm:max-w-[425px] pb-6">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
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
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
