
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminCheck = (userId: string | null) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userId) {
        console.log('useAdminCheck - No userId available');
        setIsLoading(false);
        setIsAdmin(false);
        return;
      }

      try {
        console.log('useAdminCheck - Checking admin status for userId:', userId);
        const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
        
        if (error) {
          console.error('useAdminCheck - Error checking admin status:', error);
          setError(error.message);
          setIsAdmin(false);
        } else {
          const hasAdminAccess = !!data;
          console.log('useAdminCheck - Admin status result:', hasAdminAccess);
          setIsAdmin(hasAdminAccess);
        }
      } catch (error) {
        console.error('useAdminCheck - Exception in admin check:', error);
        setError('An unexpected error occurred');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [userId]);

  return { isAdmin, isLoading, error };
};
