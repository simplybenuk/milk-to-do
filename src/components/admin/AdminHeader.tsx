
import { Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function AdminHeader() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Shield className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight`}>
          Admin Dashboard
        </h1>
      </div>
      <p className="text-muted-foreground text-sm md:text-base">
        Manage users, roles, and system settings
      </p>
    </div>
  );
}
