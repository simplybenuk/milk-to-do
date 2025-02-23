
import { Button } from '@/components/ui/button';
import { List, Check, CheckSquare, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskHeaderProps {
  currentView: 'main' | 'all' | 'completed' | 'expired';
  onViewChange: (view: 'main' | 'all' | 'completed' | 'expired') => void;
}

export function TaskHeader({ currentView, onViewChange }: TaskHeaderProps) {
  return (
    <header className="mb-8 text-center relative">
      <div className="absolute right-0 top-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('main')}>
              <Check className="mr-2 h-4 w-4" />
              Current Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('all')}>
              <List className="mr-2 h-4 w-4" />
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('completed')}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('expired')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Expired
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
        Welcome to Milk
      </div>
      <h1 className="text-4xl font-bold text-milk-900 mb-2">
        {currentView === 'main' ? 'Your Top Priority' : 'Task Overview'}
      </h1>
      <p className="text-milk-600">
        {currentView === 'main' ? 'Focus on what matters most right now' : 'Review your tasks'}
      </p>
    </header>
  );
}
