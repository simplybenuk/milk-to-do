
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { usePostHog } from '@/context/PostHogProvider';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';

export function AnalyticsSettings() {
  const [acceptsAnalytics, setAcceptsAnalytics] = useState(true);
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { posthog, isTrackingEnabled } = usePostHog();
  const { trackButtonClick } = useAnalytics();

  // Load user preferences from the database
  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get current user profile
        const { data: profiles } = await supabase
          .from('profiles')
          .select('accepts_analytics, accepts_marketing')
          .eq('id', user.id)
          .single();
          
        if (profiles) {
          setAcceptsAnalytics(profiles.accepts_analytics ?? true);
          setAcceptsMarketing(profiles.accepts_marketing ?? false);
        }
      }
    };
    
    loadPreferences();
  }, []);

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update preferences');
        return;
      }

      // Track the event before potentially disabling tracking
      if (isTrackingEnabled) {
        trackButtonClick('save_preferences', {
          accepts_analytics: acceptsAnalytics,
          accepts_marketing: acceptsMarketing
        });
      }

      // Update user metadata in auth schema
      await supabase.auth.updateUser({
        data: {
          allow_tracking: acceptsAnalytics,
          accepts_marketing: acceptsMarketing
        }
      });

      // Update profile in public schema
      const { error } = await supabase
        .from('profiles')
        .update({
          accepts_analytics: acceptsAnalytics,
          accepts_marketing: acceptsMarketing
        })
        .eq('id', user.id);

      if (error) throw error;

      // Opt out of tracking if user disabled analytics
      if (!acceptsAnalytics) {
        posthog.opt_out_capturing();
      } else {
        posthog.opt_in_capturing();
      }

      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Privacy Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how we use your data and contact you
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Analytics tracking</Label>
            <p className="text-sm text-muted-foreground">
              Help us improve by allowing anonymous usage data collection
            </p>
          </div>
          <Switch
            id="analytics"
            checked={acceptsAnalytics}
            onCheckedChange={setAcceptsAnalytics}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive occasional emails about product updates and offers
            </p>
          </div>
          <Switch
            id="marketing"
            checked={acceptsMarketing}
            onCheckedChange={setAcceptsMarketing}
          />
        </div>

        <Button 
          onClick={savePreferences} 
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
