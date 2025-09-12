
import { Button } from '@/components/ui/button';
import { List, Check, Archive, BarChart, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AppLogo } from '@/components/AppLogo';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface TaskHeaderProps {
  currentView: 'main' | 'all' | 'closed' | 'stats';
  onViewChange: (view: 'main' | 'all' | 'closed' | 'stats') => void;
  inFocusMode?: boolean;
}

export function TaskHeader({ currentView, onViewChange, inFocusMode = false }: TaskHeaderProps) {
  const navigate = useNavigate();
  const { isPro } = useSubscription();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleViewChange = (view: 'main' | 'all' | 'closed' | 'stats') => {
    // Check if user is trying to access stats but is not a Pro user
    if (view === 'stats' && !isPro) {
      toast({
        title: "Pro subscription required",
        description: "Statistics are only available to Pro subscribers.",
        variant: "destructive"
      });
      navigate('/upgrade');
      return;
    }
    
    onViewChange(view);
  };

  return (
    <header className="mb-8 text-center relative">
      <div className="absolute right-0 top-0 flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewChange('main')}>
              <Check className="mr-2 h-4 w-4" />
              Focus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewChange('all')}>
              <List className="mr-2 h-4 w-4" />
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewChange('closed')}>
              <Archive className="mr-2 h-4 w-4" />
              Closed Tasks
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleViewChange('stats')}
              disabled={!isPro}
              className={!isPro ? "opacity-50 cursor-not-allowed" : ""}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Statistics
              {!isPro && <span className="ml-2 text-xs text-muted-foreground">(Pro)</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mb-6 flex justify-center">
        <AppLogo size="large" />
      </div>
      
      <div className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground mb-4">
        {inFocusMode ? "Focus Mode Active" : "Welcome to SourList"}
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-2">
        {currentView === 'main' ? 'Your Top Priority' : 
         currentView === 'stats' ? 'Task Statistics' : 
         currentView === 'closed' ? 'Closed Tasks' : 'Task Overview'}
      </h1>
      <p className="text-muted-foreground">
        {currentView === 'main' && inFocusMode 
          ? 'Complete or skip tasks in your current focus session' 
          : currentView === 'main' 
            ? 'Focus on what matters most right now' 
            : currentView === 'stats' 
              ? 'Track your progress and task completion' 
              : currentView === 'closed' 
                ? 'Review your completed, expired, and split tasks' 
                : 'Review your tasks'}
      </p>
    </header>
  );
}
