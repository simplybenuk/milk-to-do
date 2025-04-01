
import React, { useEffect } from 'react';
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
import { SheetContent } from './SheetContent';
import useTaskStore from '@/stores/useTaskStore';
import { useAdminCheck } from '@/hooks/useAdminCheck';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const userId = useTaskStore((state) => state.userId);
  const onLogout = useTaskStore((state) => state.logout);
  const { isAdmin, isLoading, error } = useAdminCheck(userId);
  
  useEffect(() => {
    console.log('Sidebar - userId:', userId);
    console.log('Sidebar - isAdmin:', isAdmin);
    console.log('Sidebar - isLoading:', isLoading);
    console.log('Sidebar - Admin check error:', error);
  }, [userId, isAdmin, isLoading, error]);

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

          {/* Only show admin link if user is admin */}
          {isAdmin && !isLoading && (
            <NavLink 
              to="/admin" 
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-milk-700 font-semibold text-emerald-600 transition-all hover:text-emerald-800",
                  isActive ? "bg-emerald-50" : "hover:bg-emerald-50/50"
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
