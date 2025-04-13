
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSubscription() {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSubscription = async () => {
      setIsLoading(true);
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsPro(false);
          return;
        }

        // Fetch the user's profile with their plan information
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            plan_id,
            plans(name, can_edit_tasks)
          `)
          .eq('id', user.id)
          .single();

        if (profile?.plans?.can_edit_tasks) {
          setIsPro(true);
        } else {
          setIsPro(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsPro(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    isPro,
    isLoading,
  };
}
