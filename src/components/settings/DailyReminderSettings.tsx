
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DailyReminderSettingsProps {
  enabled: boolean;
  onToggle: () => void;
  reminderTime: string;
  onTimeChange: (time: string) => void;
  nextNotification: Date | null;
  notificationsEnabled: boolean;
}

export function DailyReminderSettings({
  enabled,
  onToggle,
  reminderTime,
  onTimeChange,
  nextNotification,
  notificationsEnabled
}: DailyReminderSettingsProps) {
  if (!notificationsEnabled) {
    return null;
  }

  // Handle the input change and pass the string value to the parent
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange(e.target.value);
  };

  return (
    <div className="space-y-4 pl-6 border-l-2 border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <Label htmlFor="dailyReminder">Daily reminder</Label>
        </div>
        <Switch
          id="dailyReminder"
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={!notificationsEnabled}
        />
      </div>
      
      {enabled && (
        <>
          <div className="flex items-center gap-2">
            <Label htmlFor="reminderTime" className="text-sm">Time:</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={handleTimeChange}
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
  );
}
