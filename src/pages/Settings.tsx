
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { AnalyticsSettings } from '@/components/settings/AnalyticsSettings';
import { SubscriptionSettings } from '@/components/settings/SubscriptionSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';

const Settings = () => {
  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <SettingsHeader 
          title="Settings" 
          subtitle="Configure your preferences" 
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-8">
            <SubscriptionSettings />
            
            <div className="h-px bg-gray-200" />
            
            <AnalyticsSettings />
            
            <div className="h-px bg-gray-200" />
            
            <div>
              <h3 className="text-lg font-medium text-gray-700">App Settings</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Customize your app experience
              </p>
              <ThemeSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
