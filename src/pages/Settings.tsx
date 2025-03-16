
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
  getNextScheduledNotificationTime
} from '@/utils/notifications';
import { useNotifications } from '@/hooks/use-notifications';

// Import our new components
import { NotificationToggle } from '@/components/settings/NotificationToggle';
import { DailyReminderSettings } from '@/components/settings/DailyReminderSettings';
import { NotificationPermissionInfo } from '@/components/settings/NotificationPermissionInfo';
import { NotificationStatus } from '@/components/settings/NotificationStatus';
import { TestNotificationButton } from '@/components/settings/TestNotificationButton';
import { SettingsHeader } from '@/components/settings/SettingsHeader';

const Settings = () => {
  const { 
    isSupported, 
    isEnabled: notificationsEnabled, 
    permission: notificationPermission,
    isSending,
    enableNotifications,
    disableNotifications,
    sendTest
  } = useNotifications();
  
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [nextNotification, setNextNotification] = useState<Date | null>(null);

  // Update the next notification time
  const updateNextNotificationTime = () => {
    const next = getNextScheduledNotificationTime();
    setNextNotification(next);
  };

  useEffect(() => {
    console.log('Settings page mounted, initializing state');
    
    // Load scheduled notification time
    const savedScheduledTime = getScheduledNotificationTime();
    if (savedScheduledTime) {
      setDailyReminder(true);
      setReminderTime(savedScheduledTime);
      console.log(`Loaded scheduled time: ${savedScheduledTime}`);
      
      // Update next notification time
      updateNextNotificationTime();
    } else {
      setDailyReminder(false);
      setNextNotification(null);
      console.log('No saved schedule time found');
    }
  }, []); 

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!notificationsEnabled) {
      const success = await enableNotifications();
      
      if (success) {
        toast.success('Notifications enabled');
        
        // Attempt to send a confirmation notification
        setTimeout(() => {
          console.log('Sending test notification after enabling');
          sendTest();
        }, 1000);
      } else {
        toast.error('Failed to enable notifications. Please check browser settings.');
      }
    } else {
      disableNotifications();
      setDailyReminder(false);
      setNextNotification(null);
      cancelScheduledNotifications();
      toast.success('Notifications disabled');
    }
  };

  const handleToggleDailyReminder = () => {
    if (!notificationsEnabled) return;

    if (!dailyReminder) {
      const [hours, minutes] = reminderTime.split(':').map(Number);
      console.log(`Scheduling notification for ${hours}:${minutes}`);
      
      if (scheduleDailyNotification(hours, minutes)) {
        setDailyReminder(true);
        updateNextNotificationTime();
        toast.success(`Daily reminder set for ${reminderTime}`);
      }
    } else {
      if (cancelScheduledNotifications()) {
        setDailyReminder(false);
        setNextNotification(null);
        toast.success('Daily reminder disabled');
      }
    }
  };

  // Changed: This function now accepts a string directly as required by DailyReminderSettings
  const handleReminderTimeChange = (newTime: string) => {
    setReminderTime(newTime);
    
    if (dailyReminder) {
      const [hours, minutes] = newTime.split(':').map(Number);
      console.log(`Updating scheduled time to ${hours}:${minutes}`);
      scheduleDailyNotification(hours, minutes);
      updateNextNotificationTime();
      toast.success(`Daily reminder updated to ${newTime}`);
    }
  };

  const handleTestNotification = () => {
    console.log('Requesting to send test notification');
    
    const success = sendTest();
    
    if (success) {
      toast.success('Test notification requested. Check your device for notifications.');
    } else {
      toast.error('Failed to request test notification. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <SettingsHeader 
          title="Settings" 
          subtitle="Configure your preferences" 
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <NotificationToggle
              enabled={notificationsEnabled}
              onToggle={handleToggleNotifications}
              disabled={!isSupported}
            />
            
            <NotificationStatus 
              isSupported={isSupported}
              notificationsEnabled={notificationsEnabled}
              notificationPermission={notificationPermission}
            />
            
            {notificationsEnabled && (
              <>
                <DailyReminderSettings
                  enabled={dailyReminder}
                  onToggle={handleToggleDailyReminder}
                  reminderTime={reminderTime}
                  onTimeChange={handleReminderTimeChange}
                  nextNotification={nextNotification}
                  notificationsEnabled={notificationsEnabled}
                />

                <TestNotificationButton
                  onTest={handleTestNotification}
                  isSending={isSending}
                  disabled={!notificationsEnabled || notificationPermission !== 'granted'}
                />
              </>
            )}
            
            <NotificationPermissionInfo
              isSupported={isSupported}
              permission={notificationPermission}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
