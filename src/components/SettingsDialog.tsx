
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Bell, UserCog, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { 
  isNotificationSupported, 
  areNotificationsEnabled, 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
  sendTaskReminder,
  requestNotificationPermission
} from '@/utils/notificationService';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'default'>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');

  // Reset dialog state when opened
  useEffect(() => {
    if (open) {
      console.log('Settings dialog opened, refreshing state');
      // Check if notifications are supported
      const supported = isNotificationSupported();
      setIsSupported(supported);

      if (supported) {
        // Get current permission status
        setNotificationPermission(Notification.permission);
        
        // Get saved notification preference
        const savedPreference = areNotificationsEnabled();
        setNotificationsEnabled(savedPreference);
        
        // Get saved scheduled notification time
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
    }
  }, [open]); // Re-run when dialog opens

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!notificationsEnabled) {
      // User wants to enable notifications
      if (notificationPermission !== 'granted') {
        // Request permission
        const permissionGranted = await requestNotificationPermission();
        setNotificationPermission(permissionGranted ? 'granted' : 'denied');
        
        if (permissionGranted) {
          // Permission granted, enable notifications
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          toast.success('Notifications enabled');
          
          // Test notification
          setTimeout(() => {
            console.log('Sending test notification after enabling');
            sendTaskReminder();
          }, 500);
        } else {
          // Permission denied
          toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        }
      } else {
        // Permission already granted, just enable notifications
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        toast.success('Notifications enabled');
        
        // Test notification
        setTimeout(() => {
          console.log('Sending test notification after enabling');
          sendTaskReminder();
        }, 500);
      }
    } else {
      // User wants to disable notifications
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
      // Enable daily reminder
      const [hours, minutes] = reminderTime.split(':').map(Number);
      console.log(`Scheduling notification for ${hours}:${minutes}`);
      
      if (scheduleDailyNotification(hours, minutes)) {
        setDailyReminder(true);
        toast.success(`Daily reminder set for ${reminderTime}`);
      }
    } else {
      // Disable daily reminder
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
      // Update scheduled time
      const [hours, minutes] = newTime.split(':').map(Number);
      console.log(`Updating scheduled time to ${hours}:${minutes}`);
      scheduleDailyNotification(hours, minutes);
      toast.success(`Daily reminder updated to ${newTime}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your app preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
