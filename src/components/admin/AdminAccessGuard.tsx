
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
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking admin access for userId:', userId);
        
        // Call the is_admin RPC function correctly
        const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: 'Error checking admin status',
            description: error.message,
            variant: 'destructive',
          });
          setIsAdmin(false);
        } else {
          console.log('Admin status result:', !!data);
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
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
    console.log('Admin access denied, redirecting to /app');
    return <Navigate to="/app" replace />;
  }

  console.log('Admin access granted, rendering admin content');
  return <>{children}</>;
};
