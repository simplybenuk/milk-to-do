
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionFeatures {
  isPro: boolean;
  canEditTasks: boolean;
  isLoading: boolean;
}

export function useSubscription(): SubscriptionFeatures {
  const [features, setFeatures] = useState<SubscriptionFeatures>({
    isPro: false,
    canEditTasks: false,
    isLoading: true
  });

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setFeatures({
            isPro: false,
            canEditTasks: false,
            isLoading: false
          });
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

        const isPro = profile?.plans?.name === 'Pro';
        const canEditTasks = profile?.plans?.can_edit_tasks || false;

        setFeatures({
          isPro,
          canEditTasks,
          isLoading: false
        });
      } catch (error) {
        console.error('Error checking subscription:', error);
        setFeatures({
          isPro: false,
          canEditTasks: false,
          isLoading: false
        });
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

  return features;
}
