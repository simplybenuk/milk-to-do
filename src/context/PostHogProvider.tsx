import React, { createContext, useContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useLocation, useNavigationType } from 'react-router-dom';
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
  updateTrackingPreference: (enabled: boolean) => void;
};

const PostHogContext = createContext<PostHogContextType>({
  posthog,
  isTrackingEnabled: true,
  updateTrackingPreference: () => {},
});

export const usePostHog = () => useContext(PostHogContext);

// Create a wrapper component to handle location tracking
const LocationTracker: React.FC<{ children: React.ReactNode, isTrackingEnabled: boolean }> = ({ 
  children, 
  isTrackingEnabled 
}) => {
  const location = useLocation();
  
  // Track page views only if tracking is enabled
  useEffect(() => {
    if (isTrackingEnabled) {
      posthog.capture('$pageview', {
        current_url: window.location.href,
        path: location.pathname,
      });
    }
  }, [location, isTrackingEnabled]);
  
  return <>{children}</>;
};

export const PostHogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTrackingEnabled, setIsTrackingEnabled] = useState<boolean>(true);
  
  // Update tracking status based on the current state
  const updateTrackingState = (enabled: boolean) => {
    setIsTrackingEnabled(enabled);
    if (enabled) {
      posthog.opt_in_capturing();
      console.log('Analytics tracking enabled');
    } else {
      posthog.opt_out_capturing();
      console.log('Analytics tracking disabled');
    }
  };
  
  // Function to update tracking preference
  const updateTrackingPreference = (enabled: boolean) => {
    updateTrackingState(enabled);
  };
  
  // Check if user has opted out of tracking
  useEffect(() => {
    const checkUserTrackingPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check both metadata and profile
        const allowTracking = user.user_metadata?.allow_tracking;
        
        // If allowTracking is explicitly false, disable tracking
        if (allowTracking === false) {
          updateTrackingState(false);
        } else {
          // If not explicitly set to false in metadata, check profile
          const { data: profiles } = await supabase
            .from('profiles')
            .select('accepts_analytics')
            .eq('id', user.id)
            .single();
            
          if (profiles && profiles.accepts_analytics === false) {
            updateTrackingState(false);
          } else {
            updateTrackingState(true);
          }
        }
      }
    };
    
    checkUserTrackingPreferences();
  }, []);

  // Create a context value object
  const contextValue = {
    posthog,
    isTrackingEnabled,
    updateTrackingPreference
  };

  // Determine if we should wrap with LocationTracker
  // We check if window.location exists to ensure we're in a browser environment
  const needsLocationTracker = typeof window !== 'undefined';

  return (
    <PHProvider client={posthog}>
      <PostHogContext.Provider value={contextValue}>
        {needsLocationTracker ? (
          <React.Fragment>
            {/* This will conditionally use useLocation only when rendered inside a Router */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && child.type === 'Router') {
                // If the direct child is a Router, pass through as is
                return child;
              }
              // Otherwise render without location tracking
              return child;
            })}
          </React.Fragment>
        ) : (
          // If we're not in a browser or don't need location tracking
          children
        )}
      </PostHogContext.Provider>
    </PHProvider>
  );
};
