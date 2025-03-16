
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
import { UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
  getNextScheduledNotificationTime
} from '@/utils/notifications';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationToggle } from '@/components/settings/NotificationToggle';
import { DailyReminderSettings } from '@/components/settings/DailyReminderSettings';
import { NotificationPermissionInfo } from '@/components/settings/NotificationPermissionInfo';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const {
    isSupported,
    isEnabled: notificationsEnabled,
    permission: notificationPermission,
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
    if (open) {
      console.log('Settings dialog opened, refreshing state');
    
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
    }
  }, [open]);

  const handleToggleNotifications = async () => {
    if (!isSupported) return;

    if (!notificationsEnabled) {
      const success = await enableNotifications();
      
      if (success) {
        toast.success('Notifications enabled');
        
        // Send a test notification
        setTimeout(() => {
          console.log('Sending test notification after enabling');
          sendTest();
        }, 500);
      } else {
        toast.error('Notification permission denied. Please enable notifications in your browser settings.');
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
          <NotificationToggle 
            enabled={notificationsEnabled}
            onToggle={handleToggleNotifications}
            disabled={!isSupported}
          />
          
          <DailyReminderSettings
            enabled={dailyReminder}
            onToggle={handleToggleDailyReminder}
            reminderTime={reminderTime}
            onTimeChange={handleReminderTimeChange}
            nextNotification={nextNotification}
            notificationsEnabled={notificationsEnabled}
          />
          
          <NotificationPermissionInfo
            isSupported={isSupported}
            permission={notificationPermission}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
