
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
  getScheduledNotificationTime
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

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      // Get current permission status
      setNotificationPermission(Notification.permission);
      
      // Get saved notification preference
      const savedPreference = localStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(savedPreference === 'true');
      
      // Get saved scheduled notification time
      const savedScheduledTime = getScheduledNotificationTime();
      if (savedScheduledTime) {
        setDailyReminder(true);
        setReminderTime(savedScheduledTime);
      }
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!notificationsEnabled) {
      // User wants to enable notifications
      if (notificationPermission !== 'granted') {
        // Request permission
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted') {
          // Permission granted, enable notifications
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          toast.success('Notifications enabled');
        } else {
          // Permission denied
          toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        }
      } else {
        // Permission already granted, just enable notifications
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        toast.success('Notifications enabled');
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
    setReminderTime(e.target.value);
    
    if (dailyReminder) {
      // Update scheduled time
      const [hours, minutes] = e.target.value.split(':').map(Number);
      scheduleDailyNotification(hours, minutes);
      toast.success(`Daily reminder updated to ${e.target.value}`);
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
