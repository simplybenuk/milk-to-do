import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  showCompleteButton?: boolean;
}

export function TaskItem({ task, onComplete, onDelete, showCompleteButton = false }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  // Function to detect URLs in text and convert them to clickable links
  const renderTextWithLinks = (text: string) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    if (!urlRegex.test(text)) {
      return text;
    }
    
    // Split the text by URLs and create an array of elements
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];
    
    return parts.map((part, index) => {
      // Current part is not a URL
      if (index % 2 === 0) {
        return part;
      }
      
      // Current part is a URL, replace with anchor tag
      const url = matches[Math.floor(index / 2)];
      return (
        <a 
          key={index} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
        >
          {url}
          <ExternalLink className="h-3 w-3 inline" />
        </a>
      );
    });
  };

  const handleComplete = () => {
    setIsCompleting(true);
    // Add slight delay to allow animation to play
    setTimeout(() => {
      onComplete(task.id);
    }, 300);
  };

  return (
    <>
      <div
        className={cn(
          "relative flex items-start gap-4 rounded-lg border p-4 sm:p-6 shadow-lg transition-all bg-white w-full max-w-full",
          "hover:shadow-xl animate-fade-in",
          isCompleting && "animate-task-complete",
          task.status === 'closed' && "opacity-50"
        )}
      >
        <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis">
          <h3 className="text-lg sm:text-xl font-medium text-milk-900 mb-2 sm:mb-4 break-words">
            {renderTextWithLinks(task.title)}
          </h3>
          <div className="flex flex-col gap-2">
            <span className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium w-fit",
              priorityColors[task.priority]
            )}>
              {task.priority}
            </span>
            <span className="text-xs sm:text-sm text-milk-500">
              Expires: {format(task.expiry_date, "d MMM HH:mm")}
            </span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex gap-2">
          {showCompleteButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-700 hover:bg-green-50 shrink-0"
              onClick={handleComplete}
              title="Complete task"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
            onClick={() => setShowDeleteDialog(true)}
            title="Delete task"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                onDelete(task.id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
