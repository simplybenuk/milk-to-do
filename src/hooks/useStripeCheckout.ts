
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createCheckoutSession = async (planType: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      // Get the current origin for success/cancel URLs
      const origin = window.location.origin;

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planType, 
          returnUrl: origin 
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data.message === 'Already subscribed to pro plan') {
        toast.info('You are already subscribed to the Pro plan');
        navigate('/app');
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading
  };
}
