
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
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('AdminAccessGuard - Checking admin access for userId:', userId);
        
        // Make sure we're passing the parameter correctly
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
          setIsAdmin(hasAdminAccess);
        }
      } catch (error) {
        console.error('AdminAccessGuard - Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure userId is properly loaded
    const timer = setTimeout(() => {
      checkAdminAccess();
    }, 100);
    
    return () => clearTimeout(timer);
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
