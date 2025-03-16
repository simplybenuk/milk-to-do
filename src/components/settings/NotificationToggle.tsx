
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

interface NotificationToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function NotificationToggle({ enabled, onToggle, disabled = false }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <Label htmlFor="notifications">Notifications</Label>
      </div>
      <Switch
        id="notifications"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
}
