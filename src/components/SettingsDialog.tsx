
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
import { Bell, UserCog, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  scheduleDailyNotification,
  cancelScheduledNotifications,
  getScheduledNotificationTime,
  getNextScheduledNotificationTime
} from '@/utils/notifications';
import { useNotifications } from '@/hooks/use-notifications';

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

  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
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
                <>
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
                  
                  {nextNotification && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Next notification: {format(nextNotification, 'PPp')}</span>
                    </div>
                  )}
                </>
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
