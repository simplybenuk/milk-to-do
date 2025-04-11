
import { differenceInDays } from 'date-fns';
import { Clock, Hourglass } from 'lucide-react';

interface TaskAgeIndicatorProps {
  createdAt: Date;
  expiryDate: Date;
}

export function TaskAgeIndicator({ createdAt, expiryDate }: TaskAgeIndicatorProps) {
  const ageInDays = differenceInDays(new Date(), createdAt);
  const daysUntilExpiry = differenceInDays(expiryDate, new Date());
  
  let status: 'fresh' | 'spoiling' | 'sour' | 'expired';
  let label: string;
  
  if (daysUntilExpiry < 0) {
    status = 'expired';
    label = 'Expired';
  } else if (ageInDays >= 21) {
    status = 'sour';
    label = 'Sour';
  } else if (ageInDays >= 8) {
    status = 'spoiling';
    label = 'Spoiling';
  } else {
    status = 'fresh';
    label = 'Fresh';
  }
  
  const statusConfig = {
    fresh: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: Clock
    },
    spoiling: {
      bg: "bg-amber-100",
      text: "text-amber-800", 
      border: "border-amber-200",
      icon: Clock
    },
    sour: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
      icon: Hourglass
    },
    expired: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: Hourglass
    }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  );
}
