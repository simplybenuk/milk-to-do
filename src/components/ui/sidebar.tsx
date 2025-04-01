
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Settings,
  ListChecks,
  Shield,
  LogOut
} from 'lucide-react';
import { AppLogo } from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetContent } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from '@/hooks/use-toast';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const userId = useTaskStore((state) => state.userId);
  const onLogout = useTaskStore((state) => state.logout);

  // Configure a more aggressive query to check admin status
  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      try {
        console.log('Checking admin status for user:', userId);
        
        // Call the is_admin RPC function
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userId 
        });
        
        if (error) {
          console.error('Sidebar - Error checking admin status:', error);
          toast({
            title: 'Error checking admin status',
            description: error.message,
            variant: 'destructive',
          });
          return false;
        }
        
        const hasAdminAccess = !!data;
        console.log('Sidebar - Admin check result:', hasAdminAccess);
        return hasAdminAccess;
      } catch (error) {
        console.error('Sidebar - Exception in admin check:', error);
        return false;
      }
    },
    enabled: !!userId,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 60000, // Keep in cache for 1 minute
  });

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await onLogout();
    if (onClose) onClose();
  };
  
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  console.log('Sidebar render - userId:', userId, 'isAdmin:', isAdmin);

  return (
    <SheetContent side="left" className="p-0 flex flex-col w-[300px]">
      <div className="p-6">
        <AppLogo size="medium" />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          <NavLink 
            to="/app" 
            onClick={handleLinkClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-milk-700 transition-all hover:text-milk-900",
                isActive ? "bg-milk-100" : "hover:bg-milk-100/50"
              )
            }
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/app/all-tasks" 
            onClick={handleLinkClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-milk-700 transition-all hover:text-milk-900",
                isActive || isActiveRoute('/app/done') ? "bg-milk-100" : "hover:bg-milk-100/50"
              )
            }
          >
            <ListChecks className="h-5 w-5" />
            <span>All Tasks</span>
          </NavLink>

          {/* Always show the admin link if isAdmin is true */}
          {isAdmin === true && (
            <NavLink 
              to="/admin" 
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-milk-700 transition-all hover:text-milk-900",
                  isActive ? "bg-milk-100" : "hover:bg-milk-100/50"
                )
              }
            >
              <Shield className="h-5 w-5" />
              <span>Admin</span>
            </NavLink>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="space-y-2">
          <NavLink 
            to="/settings" 
            onClick={handleLinkClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-milk-700 transition-all hover:text-milk-900",
                isActive ? "bg-milk-100" : "hover:bg-milk-100/50"
              )
            }
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-none gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};
