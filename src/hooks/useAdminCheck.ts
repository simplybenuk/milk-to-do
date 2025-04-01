
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Simple cache to prevent redundant API calls
const adminStatusCache = new Map<string, boolean>();

export const useAdminCheck = (userId: string | null | undefined) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if we've already checked this userId in this component instance
  const checkedUserIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        // Reset state when userId changes
        setError(null);
        
        // No userId provided, try to get it from session
        if (!userId) {
          console.log('useAdminCheck - No userId provided, checking session');
          setIsLoading(true);
          
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const sessionUserId = session.user.id;
            console.log('useAdminCheck - Found user in session:', sessionUserId);
            
            // Check cache first
            if (adminStatusCache.has(sessionUserId)) {
              const cachedStatus = adminStatusCache.get(sessionUserId);
              console.log('useAdminCheck - Using cached admin status:', cachedStatus);
              
              if (isMounted) {
                setIsAdmin(cachedStatus || false);
                setIsLoading(false);
              }
              return;
            }
            
            if (isMounted) {
              await performAdminCheck(sessionUserId);
            }
          } else {
            console.log('useAdminCheck - No session available');
            if (isMounted) {
              setIsAdmin(false);
              setIsLoading(false);
            }
          }
          return;
        }
        
        // Check if we already checked this userId in this component instance
        if (checkedUserIds.current.has(userId)) {
          console.log('useAdminCheck - Already checked this userId in this component');
          return;
        }
        
        // Check cache first
        if (adminStatusCache.has(userId)) {
          const cachedStatus = adminStatusCache.get(userId);
          console.log('useAdminCheck - Using cached admin status:', cachedStatus);
          
          if (isMounted) {
            setIsAdmin(cachedStatus || false);
            setIsLoading(false);
            checkedUserIds.current.add(userId);
          }
          return;
        }
        
        // Perform the actual check
        if (isMounted) {
          setIsLoading(true);
          await performAdminCheck(userId);
          checkedUserIds.current.add(userId);
        }
      } catch (err) {
        console.error('useAdminCheck - Error in checkAdminStatus:', err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    };
    
    const performAdminCheck = async (userIdToCheck: string) => {
      try {
        console.log('useAdminCheck - Performing admin check for:', userIdToCheck);
        
        const { data, error } = await supabase.rpc('is_admin', { 
          user_id: userIdToCheck 
        });
        
        console.log('useAdminCheck - Admin check response:', { data, error });
        
        if (error) {
          console.error('useAdminCheck - Error in admin check:', error);
          if (isMounted) {
            setError(error.message);
            setIsAdmin(false);
          }
        } else {
          console.log('useAdminCheck - Admin status result:', data);
          
          // Cache the result
          adminStatusCache.set(userIdToCheck, !!data);
          
          if (isMounted) {
            setIsAdmin(!!data);
          }
        }
      } catch (error: any) {
        console.error('useAdminCheck - Exception in admin check:', error);
        
        if (isMounted) {
          setError(error?.message || 'An unexpected error occurred');
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAdminStatus();
    
    // Clean up function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Clear cache when user logs out
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log('useAdminCheck - User signed out, clearing admin cache');
        adminStatusCache.clear();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, error };
};
