
import React, { createContext, useContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// PostHog configuration
const posthogKey = 'phc_gSNH9jDCPG7FDOBaEjCqdPZnqI6m4F7Jujd1R41fFuA';
const posthogHost = 'https://eu.i.posthog.com';

// Initialize PostHog
if (!posthog.__loaded) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false, // We'll handle this manually
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    persistence: 'localStorage', // Use localStorage for better persistence
  });
}

type PostHogContextType = {
  posthog: typeof posthog;
  isTrackingEnabled: boolean;
};

const PostHogContext = createContext<PostHogContextType>({
  posthog,
  isTrackingEnabled: true,
});

export const usePostHog = () => useContext(PostHogContext);

export const PostHogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isTrackingEnabled, setIsTrackingEnabled] = useState<boolean>(true);
  
  // Check if user has opted out of tracking
  useEffect(() => {
    const checkUserTrackingPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user preferences from user metadata
        const allowTracking = user.user_metadata?.allow_tracking;
        // If allowTracking is explicitly false, disable tracking
        if (allowTracking === false) {
          setIsTrackingEnabled(false);
          // Opt out of tracking in PostHog
          posthog.opt_out_capturing();
          console.log('User opted out of analytics tracking');
        } else {
          setIsTrackingEnabled(true);
          posthog.opt_in_capturing();
          console.log('Analytics tracking enabled for user');
        }
      }
    };
    
    checkUserTrackingPreferences();
  }, []);

  // Track page views only if tracking is enabled
  useEffect(() => {
    if (isTrackingEnabled) {
      posthog.capture('$pageview', {
        current_url: window.location.href,
        path: location.pathname,
      });
    }
  }, [location, isTrackingEnabled]);

  return (
    <PHProvider client={posthog}>
      <PostHogContext.Provider value={{ posthog, isTrackingEnabled }}>
        {children}
      </PostHogContext.Provider>
    </PHProvider>
  );
};
