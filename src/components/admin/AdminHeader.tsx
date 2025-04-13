
import { Shield } from 'lucide-react';

export function AdminHeader() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Manage users, roles, and system settings
      </p>
    </div>
  );
}
