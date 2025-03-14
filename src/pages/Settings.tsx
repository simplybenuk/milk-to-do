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
  areNotificationsEnabled, 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
  sendTaskReminder,
  requestNotificationPermission,
  triggerTestNotification
} from '@/utils/notificationService';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Settings page mounted, initializing state');
    const supported = isNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      setNotificationPermission(Notification.permission);
      
      const savedPreference = areNotificationsEnabled();
      setNotificationsEnabled(savedPreference);
      
      const savedScheduledTime = getScheduledNotificationTime();
      if (savedScheduledTime) {
        setDailyReminder(true);
        setReminderTime(savedScheduledTime);
        console.log(`Loaded scheduled time: ${savedScheduledTime}`);
      } else {
        setDailyReminder(false);
        console.log('No saved schedule time found');
      }
    }
  }, []); 

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!notificationsEnabled) {
      if (notificationPermission !== 'granted') {
        const permissionGranted = await requestNotificationPermission();
        setNotificationPermission(permissionGranted ? 'granted' : 'denied');
        
        if (permissionGranted) {
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          toast.success('Notifications enabled');
          
          setTimeout(() => {
            console.log('Sending test notification after enabling');
            sendTaskReminder();
          }, 500);
        } else {
          toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        }
      } else {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        toast.success('Notifications enabled');
        
        setTimeout(() => {
          console.log('Sending test notification after enabling');
          sendTaskReminder();
        }, 500);
      }
    } else {
      setNotificationsEnabled(false);
      setDailyReminder(false);
      localStorage.setItem('notificationsEnabled', 'false');
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
    console.log('Sending test notification from button click');
    const success = triggerTestNotification();
    if (success) {
      toast.success('Test notification sent');
    } else {
      toast.error('Failed to send test notification');
    }
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
                  >
                    <AlertCircle className="h-4 w-4" />
                    Send Test Notification
                  </Button>
                </div>
              </div>
            )}
            
            {!isSupported && (
              <p className="text-sm text-muted-foreground">
                Notifications are not supported in this browser.
              </p>
            )}
            {notificationPermission === 'denied' && (
              <p className="text-sm text-red-500">
                Notification permission denied. Please enable notifications in your browser settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
