
import { SettingsHeader } from '@/components/settings/SettingsHeader';

const Settings = () => {
  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <SettingsHeader 
          title="Settings" 
          subtitle="Configure your preferences" 
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Settings options coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
