
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAdminCheck = (userId: string | null | undefined) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('useAdminCheck - Starting admin check with userId:', userId);
      
      try {
        // If no userId provided, try to get it from session
        if (!userId) {
          console.log('useAdminCheck - No userId provided, checking session');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log('useAdminCheck - Found user in session:', session.user.id);
            await checkAdminWithUserId(session.user.id);
          } else {
            console.log('useAdminCheck - No session available');
            setIsAdmin(false);
            setIsLoading(false);
          }
        } else {
          // We have a userId, use it directly
          await checkAdminWithUserId(userId);
        }
      } catch (err) {
        console.error('useAdminCheck - Error in checkAdminStatus:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsAdmin(false);
        setIsLoading(false);
      }
    };
    
    const checkAdminWithUserId = async (userIdToCheck: string) => {
      try {
        console.log('useAdminCheck - Performing direct admin check for:', userIdToCheck);
        
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userIdToCheck 
        });
        
        console.log('useAdminCheck - Admin check raw response:', { data, error });
        
        if (error) {
          console.error('useAdminCheck - Error in admin check:', error);
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
    
    checkAdminStatus().then(
      undefined, 
      (err) => {
        console.error('useAdminCheck - Unhandled promise rejection:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
        setIsAdmin(false);
      }
    );
  }, [userId]);

  return { isAdmin, isLoading, error };
};
