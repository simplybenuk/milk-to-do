
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskAgeIndicatorProps {
  createdAt: Date;
  expiryDate: Date;
  className?: string;
  showText?: boolean;
}

export function TaskAgeIndicator({ 
  createdAt, 
  expiryDate, 
  className,
  showText = true 
}: TaskAgeIndicatorProps) {
  const now = new Date();
  const ageInDays = differenceInDays(now, createdAt);
  const daysUntilExpiry = differenceInDays(expiryDate, now);
  
  // Determine status based on age
  const getAgeStatus = () => {
    if (daysUntilExpiry < 0) {
      return {
        status: 'expired',
        label: 'Expired',
        colorClass: 'bg-expired-accent'
      };
    } else if (ageInDays >= 21) {
      return {
        status: 'sour',
        label: 'Sour',
        colorClass: 'bg-sour-accent'
      };
    } else if (ageInDays >= 8) {
      return {
        status: 'spoiling',
        label: 'Spoiling',
        colorClass: 'bg-spoiling-accent'
      };
    } else {
      return {
        status: 'fresh',
        label: 'Fresh',
        colorClass: 'bg-fresh-accent'
      };
    }
  };

  const ageStatus = getAgeStatus();
  const isExpired = ageStatus.status === 'expired';

  return (
    <div className={cn(
      "flex items-center gap-2",
      isExpired && "stink-cloud",
      className
    )}>
      <div className={cn(
        "h-2 w-2 rounded-full",
        ageStatus.colorClass
      )} />
      {showText && (
        <span className={cn(
          "text-xs",
          isExpired && "font-semibold",
          ageStatus.status === 'sour' && "animate-wobble font-medium"
        )}>
          {ageStatus.label}
        </span>
      )}
    </div>
  );
}
