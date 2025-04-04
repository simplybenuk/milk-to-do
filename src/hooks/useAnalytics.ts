
import { usePostHog } from '@/context/PostHogProvider';

export function useAnalytics() {
  const { posthog } = usePostHog();

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  };

  const trackButtonClick = (buttonName: string, properties?: Record<string, any>) => {
    trackEvent(`button_clicked`, {
      button_name: buttonName,
      ...properties,
    });
  };

  const trackPageView = (pageName: string, properties?: Record<string, any>) => {
    trackEvent(`page_viewed`, {
      page_name: pageName,
      ...properties,
    });
  };

  const trackFeatureUsage = (featureName: string, properties?: Record<string, any>) => {
    trackEvent(`feature_used`, {
      feature_name: featureName,
      ...properties,
    });
  };

  const identifyUser = (userId: string, traits?: Record<string, any>) => {
    posthog.identify(userId, traits);
  };

  return {
    trackEvent,
    trackButtonClick,
    trackPageView,
    trackFeatureUsage,
    identifyUser,
  };
}
