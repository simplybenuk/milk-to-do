
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminCheck = (userId: string | null | undefined) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('useAdminCheck - Starting check with userId:', userId);
      
      if (!userId) {
        console.log('useAdminCheck - No userId available, trying to get from session');
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const sessionUserId = session.user.id;
            console.log('useAdminCheck - Retrieved userId from session:', sessionUserId);
            
            // Call checkAdminWithUserId with the session user ID
            await checkAdminWithUserId(sessionUserId);
          } else {
            console.log('useAdminCheck - No user in session');
            setIsLoading(false);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('useAdminCheck - Error getting session:', err);
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          setIsLoading(false);
          setIsAdmin(false);
        }
      } else {
        // Use the provided userId
        await checkAdminWithUserId(userId);
      }
    };
    
    const checkAdminWithUserId = async (userIdToCheck: string) => {
      try {
        console.log('useAdminCheck - Checking admin status for userId:', userIdToCheck);
        
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userIdToCheck 
        });
        
        console.log('useAdminCheck - Raw response:', { data, error });
        
        if (error) {
          console.error('useAdminCheck - Error checking admin status:', error);
          setError(error.message);
          setIsAdmin(false);
        } else {
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
    
    checkAdminStatus().then(undefined, (err) => {
      console.error('useAdminCheck - Unhandled promise rejection:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setIsLoading(false);
      setIsAdmin(false);
    });
  }, [userId]);

  return { isAdmin, isLoading, error };
};
