
import { format } from 'date-fns';
import { Task } from '@/types/task';

export function exportTasksToMarkdown(tasks: Task[]): void {
  if (tasks.length === 0) {
    alert('No tasks to export');
    return;
  }

  const markdown = generateTasksMarkdown(tasks);
  downloadMarkdownFile(markdown, 'sourlist-tasks.md');
}

function generateTasksMarkdown(tasks: Task[]): string {
  const header = `# SourList Tasks Export\n\nExported on: ${format(new Date(), 'PPP')}\nTotal tasks: ${tasks.length}\n\n`;
  
  const tasksList = tasks.map((task, index) => {
    const expiryDate = format(new Date(task.expiry_date), 'PPP');
    const priorityScore = Math.round(task.priority_score);
    
    return `## ${index + 1}. ${task.title}

**Priority Score:** ${priorityScore}  
**Priority Level:** ${task.priority}  
**Expires:** ${expiryDate}  
**Status:** ${task.status}  
${task.tags && task.tags.length > 0 ? `**Tags:** ${task.tags.join(', ')}  ` : ''}

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
