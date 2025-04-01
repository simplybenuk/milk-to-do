
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminCheck = (userId: string | null | undefined) => {
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
          // The is_admin function returns a boolean
          console.log('useAdminCheck - Admin status result:', data);
          setIsAdmin(!!data);
        }
      } catch (error: any) {
        console.error('useAdminCheck - Exception in admin check:', error);
        setError(error?.message || 'An unexpected error occurred');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Reset states when userId changes
    setIsLoading(true);
    setError(null);
    
    checkAdminStatus();
  }, [userId]);

  return { isAdmin, isLoading, error };
};
