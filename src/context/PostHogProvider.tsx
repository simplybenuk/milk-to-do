
import React, { createContext, useContext, useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useLocation } from 'react-router-dom';

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
};

const PostHogContext = createContext<PostHogContextType>({
  posthog,
});

export const usePostHog = () => useContext(PostHogContext);

export const PostHogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    posthog.capture('$pageview', {
      current_url: window.location.href,
      path: location.pathname,
    });
  }, [location]);

  return (
    <PHProvider client={posthog}>
      <PostHogContext.Provider value={{ posthog }}>
        {children}
      </PostHogContext.Provider>
    </PHProvider>
  );
};
