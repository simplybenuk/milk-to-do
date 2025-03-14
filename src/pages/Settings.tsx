
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  isNotificationSupported, 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
} from '@/utils/notifications';
import { useNotifications } from '@/hooks/use-notifications';

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
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Settings page mounted, initializing state');
    
    // Load scheduled notification time
    const savedScheduledTime = getScheduledNotificationTime();
    if (savedScheduledTime) {
      setDailyReminder(true);
      setReminderTime(savedScheduledTime);
      console.log(`Loaded scheduled time: ${savedScheduledTime}`);
    } else {
      setDailyReminder(false);
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
        toast.success(`Daily reminder set for ${reminderTime}`);
      }
    } else {
      if (cancelScheduledNotifications()) {
        setDailyReminder(false);
        toast.success('Daily reminder disabled');
      }
    }
  };

  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    
    if (dailyReminder) {
      const [hours, minutes] = newTime.split(':').map(Number);
      console.log(`Updating scheduled time to ${hours}:${minutes}`);
      scheduleDailyNotification(hours, minutes);
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

  const getNotificationStatus = () => {
    if (!isSupported) {
      return "Not supported in this browser";
    }
    if (notificationPermission === 'denied') {
      return "Blocked in browser settings";
    }
    if (notificationPermission !== 'granted') {
      return "Permission not granted";
    }
    if (!notificationsEnabled) {
      return "Disabled in app settings";
    }
    return "Enabled";
  };

  return (
    <div className="min-h-screen bg-milk-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 relative">
          <div className="absolute left-0 top-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-milk-100 px-3 py-1 text-sm text-milk-800 mb-4">
              App Settings
            </div>
            <h1 className="text-4xl font-bold text-milk-900 mb-2">Settings</h1>
            <p className="text-milk-600">Configure your preferences</p>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
                disabled={!isSupported}
              />
            </div>
            
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
              <p>Status: <span className={notificationsEnabled && notificationPermission === 'granted' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {getNotificationStatus()}
              </span></p>
            </div>
            
            {notificationsEnabled && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <Label htmlFor="dailyReminder">Daily reminder</Label>
                  </div>
                  <Switch
                    id="dailyReminder"
                    checked={dailyReminder}
                    onCheckedChange={handleToggleDailyReminder}
                    disabled={!notificationsEnabled}
                  />
                </div>
                
                {dailyReminder && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="reminderTime" className="text-sm">Time:</Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={reminderTime}
                      onChange={handleReminderTimeChange}
                      className="w-24"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    onClick={handleTestNotification}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isSending || !notificationsEnabled || notificationPermission !== 'granted'}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {isSending ? 'Sending...' : 'Send Test Notification'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will send a real notification to your device. If you don't see it, check your device's notification settings.
                  </p>
                </div>
              </div>
            )}
            
            {!isSupported && (
              <p className="text-sm text-muted-foreground">
                Notifications are not supported in this browser.
              </p>
            )}
            {notificationPermission === 'denied' && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <p className="font-semibold">Notification permission denied</p>
                <p className="mt-1">You'll need to enable notifications in your browser settings:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Chrome: Site settings &gt; Notifications</li>
                  <li>Firefox: Site permissions &gt; Notifications</li>
                  <li>Safari: Preferences &gt; Websites &gt; Notifications</li>
                  <li>Mobile: Check system notification settings for your browser</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
