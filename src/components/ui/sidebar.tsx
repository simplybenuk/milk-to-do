
import React, { useEffect, useState } from 'react';
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
  const [isAdminLocal, setIsAdminLocal] = useState<boolean>(false);

  // Direct check for admin status outside of React Query for debugging
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (!userId) return;
      
      try {
        console.log('Direct admin check in Sidebar - userId:', userId);
        const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
        
        if (error) {
          console.error('Direct admin check error in Sidebar:', error);
          return;
        }
        
        const hasAdminAccess = !!data;
        console.log('Direct admin check result in Sidebar:', hasAdminAccess);
        
        if (hasAdminAccess) {
          toast({
            title: 'Admin Access Confirmed',
            description: 'Your admin privileges have been verified',
          });
        }
        
        setIsAdminLocal(hasAdminAccess);
      } catch (error) {
        console.error('Exception in direct admin check in Sidebar:', error);
      }
    };
    
    checkAdminDirectly();
  }, [userId]);

  // React Query for admin status with correct v5 parameter names
  const { data: isAdmin, isLoading, error } = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      try {
        console.log('Sidebar useQuery - Checking admin status for user:', userId);
        
        // Call the is_admin RPC function
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userId 
        });
        
        if (error) {
          console.error('Sidebar useQuery - Error checking admin status:', error);
          toast({
            title: 'Error checking admin status',
            description: error.message,
            variant: 'destructive',
          });
          return false;
        }
        
        const hasAdminAccess = !!data;
        console.log('Sidebar useQuery - Admin check result:', hasAdminAccess);
        return hasAdminAccess;
      } catch (error) {
        console.error('Sidebar useQuery - Exception in admin check:', error);
        return false;
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 30000, // Keep in cache for 30 seconds (renamed from cacheTime)
  });

  useEffect(() => {
    if (isAdmin === true) {
      console.log('Admin status confirmed via React Query, user should see admin link');
    }
    
    if (isAdminLocal === true) {
      console.log('Admin status confirmed via direct check, user should see admin link');
    }
  }, [isAdmin, isAdminLocal]);

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

  console.log('Sidebar render - userId:', userId, 'React Query isAdmin:', isAdmin, 'Direct isAdmin:', isAdminLocal);

  // Show admin link if either check confirms admin status
  const showAdminLink = isAdmin === true || isAdminLocal === true;

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

          {/* Always show the admin link if either check confirms admin status */}
          {showAdminLink && (
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
