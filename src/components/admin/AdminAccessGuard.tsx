
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useTaskStore from '@/stores/useTaskStore';
import { toast } from '@/hooks/use-toast';

export const AdminAccessGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useTaskStore((state) => state.userId);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!userId) {
        console.log('AdminAccessGuard - No userId, denying access');
        toast({
          title: 'Access Denied',
          description: 'You need to log in first',
          variant: 'destructive',
        });
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('AdminAccessGuard - Checking admin access for userId:', userId);
        
        // Make a direct call to check admin status
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userId 
        });
        
        if (error) {
          console.error('AdminAccessGuard - Error checking admin status:', error);
          toast({
            title: 'Error checking admin status',
            description: error.message,
            variant: 'destructive',
          });
          setIsAdmin(false);
        } else {
          const hasAdminAccess = !!data;
          console.log('AdminAccessGuard - Admin status result:', hasAdminAccess);
          
          if (hasAdminAccess) {
            toast({
              title: 'Admin Access',
              description: 'You have admin access',
            });
          } else {
            toast({
              title: 'Access Denied',
              description: 'You do not have admin privileges',
              variant: 'destructive',
            });
          }
          
          setIsAdmin(hasAdminAccess);
        }
      } catch (error) {
        console.error('AdminAccessGuard - Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      checkAdminAccess();
    } else {
      // Set a timer to check again if userId is available after a short delay
      const timer = setTimeout(() => {
        if (userId) {
          checkAdminAccess();
        } else {
          console.log('AdminAccessGuard - userId still not available after delay');
          setIsAdmin(false);
          setIsLoading(false);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('AdminAccessGuard - Access denied, redirecting to /app');
    return <Navigate to="/app" replace />;
  }

  console.log('AdminAccessGuard - Access granted, rendering admin content');
  return <>{children}</>;
};
