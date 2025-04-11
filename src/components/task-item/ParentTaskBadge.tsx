
import { FolderTree } from 'lucide-react';

export function ParentTaskBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
      <FolderTree className="h-3 w-3" />
      <span>Parent</span>
    </div>
  );
}
