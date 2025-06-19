
import { format, isValid } from 'date-fns';
import { Task } from '@/types/task';
import useTagStore from '@/stores/useTagStore';
import { sanitizeHtml, logSecurityEvent } from './security';

export function exportTasksToMarkdown(tasks: Task[]): void {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  try {
    const markdown = generateTasksMarkdown(tasks);
    downloadMarkdownFile(markdown, 'sourlist-tasks.md');
    
    logSecurityEvent('task_export', { 
      type: 'download', 
      taskCount: tasks.length 
    });
  } catch (error) {
    console.error('Error exporting tasks:', error);
    alert('Failed to export tasks. Please try again.');
  }
}

export function copyTasksToClipboard(tasks: Task[]): Promise<void> {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error('No tasks to copy');
  }

  try {
    const markdown = generateTasksMarkdown(tasks);
    
    logSecurityEvent('task_export', { 
      type: 'clipboard', 
      taskCount: tasks.length 
    });
    
    return navigator.clipboard.writeText(markdown);
  } catch (error) {
    console.error('Error copying tasks to clipboard:', error);
    throw new Error('Failed to copy tasks to clipboard');
  }
}

function generateTasksMarkdown(tasks: Task[]): string {
  if (!Array.isArray(tasks)) {
    throw new Error('Invalid tasks data');
  }

  const exportDate = new Date();
  const header = `# SourList Tasks Export\n\nExported on: ${format(exportDate, 'PPP')}\nTotal tasks: ${tasks.length}\n\n`;
  
  // Get all tags from the store to resolve tag IDs to names
  const { tags } = useTagStore.getState();
  
  const tasksList = tasks.map((task, index) => {
    if (!task || typeof task !== 'object') {
      console.warn(`Invalid task at index ${index}:`, task);
      return '';
    }

    // Sanitize task title
    const sanitizedTitle = sanitizeHtml(task.title || 'Untitled');
    
    // Validate and format expiry date
    let expiryDate = 'Invalid Date';
    if (task.expiry_date) {
      const date = new Date(task.expiry_date);
      if (isValid(date)) {
        expiryDate = format(date, 'PPP');
      }
    }
    
    // Safely calculate priority score
    const priorityScore = typeof task.priority_score === 'number' 
      ? Math.round(Math.max(0, task.priority_score))
      : 0;
    
    // Convert tag IDs to tag names with validation
    const tagNames = Array.isArray(task.tags) && task.tags.length > 0 
      ? task.tags
          .map(tagId => {
            if (typeof tagId !== 'string') return null;
            const tag = tags.find(t => t && t.id === tagId);
            return tag ? sanitizeHtml(tag.name) : null;
          })
          .filter(Boolean)
      : [];
    
    // Sanitize priority and status
    const priority = ['high', 'medium', 'low'].includes(task.priority) 
      ? task.priority 
      : 'medium';
    const status = ['open', 'closed'].includes(task.status) 
      ? task.status 
      : 'open';
    
    return `## ${index + 1}. ${sanitizedTitle}

**Priority Score:** ${priorityScore}  
**Priority Level:** ${priority}  
**Expires:** ${expiryDate}  
**Status:** ${status}  
${tagNames.length > 0 ? `**Tags:** ${tagNames.join(', ')}  ` : ''}

---
`;
  }).filter(Boolean).join('\n');

  return header + tasksList;
}

function downloadMarkdownFile(content: string, filename: string): void {
  try {
    // Validate filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');
    if (!sanitizedFilename.endsWith('.md')) {
      throw new Error('Invalid filename');
    }
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error('Failed to download file');
  }
}
