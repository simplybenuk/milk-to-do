import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === 'dark');
  }, [theme]);

  const handleToggle = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="dark-mode">Dark mode</Label>
          <p className="text-sm text-muted-foreground">
            Switch between light and dark themes
          </p>
        </div>
        <Switch
          id="dark-mode"
          checked={isDark}
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
}

export default ThemeSettings;
