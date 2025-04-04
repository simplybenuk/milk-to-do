
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

  /**
   * Identify a user in PostHog analytics
   * @param userId Unique identifier for the user
   * @param traits Optional user properties/traits like email, name, etc.
   */
  const identifyUser = (userId: string, traits?: Record<string, any>) => {
    if (!userId) {
      console.warn('User ID is required for PostHog identification');
      return;
    }
    
    // Identify the user in PostHog
    posthog.identify(userId, traits);
    
    console.log(`User identified in PostHog: ${userId}`);
  };

  /**
   * Reset the current user identification (typically used at logout)
   */
  const resetIdentity = () => {
    posthog.reset();
    console.log('User identity reset in PostHog');
  };

  return {
    trackEvent,
    trackButtonClick,
    trackPageView,
    trackFeatureUsage,
    identifyUser,
    resetIdentity,
  };
}
