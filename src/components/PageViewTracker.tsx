
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from '@/context/PostHogProvider';

interface PageViewTrackerProps {
  children: React.ReactNode;
}

export function PageViewTracker({ children }: PageViewTrackerProps) {
  const location = useLocation();
  const { posthog, isTrackingEnabled } = usePostHog();
  
  // Track page views only if tracking is enabled
  useEffect(() => {
    if (isTrackingEnabled) {
      posthog.capture('$pageview', {
        current_url: window.location.href,
        path: location.pathname,
      });
      console.log(`Page view tracked: ${location.pathname}`);
    }
  }, [location, isTrackingEnabled, posthog]);
  
  return <>{children}</>;
}
