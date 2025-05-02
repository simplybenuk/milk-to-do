
import React from 'react';
import { Task } from '@/types/task';
import { TextWithLinks } from './TextWithLinks';
import { ParentTaskLink } from './ParentTaskLink';
import { TaskTags } from './TaskTags';
import { TaskMetadata } from './TaskMetadata';

interface TaskContentProps {
  task: Task;
  parentId?: string;
  parentTitle?: string;
  onViewParent?: (parentId: string) => void;
  handleRemoveTag?: (tagId: string) => void;
  inFocusMode?: boolean;
}

export function TaskContent({
  task,
  parentId,
  parentTitle,
  onViewParent,
  handleRemoveTag,
  inFocusMode = false
}: TaskContentProps) {
  return (
    <div className="flex-1 min-w-0 overflow-hidden break-words mb-2 w-full">
      {/* Parent task link with added props */}
      <ParentTaskLink 
        parentId={parentId} 
        onViewParent={onViewParent} 
        inFocusMode={inFocusMode}
        parentTitle={parentTitle}
      />
      
      <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4 break-words pr-8 w-full">
        <TextWithLinks text={task.title} />
      </h3>
      
      {/* Task tags - moved to a more prominent position */}
      {task.tags && task.tags.length > 0 && (
        <TaskTags 
          taskId={task.id} 
          tags={task.tags} 
          onRemoveTag={!inFocusMode ? handleRemoveTag : undefined}
          className="mb-3 w-full"
        />
      )}
      
      {/* Task metadata section */}
      <TaskMetadata task={task} />
    </div>
  );
}
