
import { format } from 'date-fns';
import { Task } from '@/types/task';
import useTagStore from '@/stores/useTagStore';

export function exportTasksToMarkdown(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  const markdown = generateTasksMarkdown(tasks);
  downloadMarkdownFile(markdown, 'sourlist-tasks.md');
}

export function copyTasksToClipboard(tasks: Task[]): Promise<void> {
  if (tasks.length === 0) {
    throw new Error('No tasks to copy');
  }

  const markdown = generateTasksMarkdown(tasks);
  return navigator.clipboard.writeText(markdown);
}

function generateTasksMarkdown(tasks: Task[]): string {
  const header = `# SourList Tasks Export\n\nExported on: ${format(new Date(), 'PPP')}\nTotal tasks: ${tasks.length}\n\n`;
  
  // Get all tags from the store to resolve tag IDs to names
  const { tags } = useTagStore.getState();
  
  const tasksList = tasks.map((task, index) => {
    const expiryDate = format(new Date(task.expiry_date), 'PPP');
    const priorityScore = Math.round(task.priority_score);
    
    // Convert tag IDs to tag names
    const tagNames = task.tags && task.tags.length > 0 
      ? task.tags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? tag.name : tagId; // Fallback to ID if tag not found
        })
      : [];
    
    return `## ${index + 1}. ${task.title}

**Priority Score:** ${priorityScore}  
**Priority Level:** ${task.priority}  
**Expires:** ${expiryDate}  
**Status:** ${task.status}  
${tagNames.length > 0 ? `**Tags:** ${tagNames.join(', ')}  ` : ''}

---
`;
  }).join('\n');

  return header + tasksList;
}

function downloadMarkdownFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
