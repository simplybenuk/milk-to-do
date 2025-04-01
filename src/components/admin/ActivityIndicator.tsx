
import React from 'react';
import { format, formatDistanceToNow, isAfter, subDays } from 'date-fns';

interface ActivityIndicatorProps {
  date: string | null;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ date }) => {
  if (!date) {
    return <span className="text-gray-400">Never</span>;
  }

  const dateObj = new Date(date);
  const today = new Date();
  const isRecent = isAfter(dateObj, subDays(today, 7));

  return (
    <span 
      className={isRecent ? 'text-emerald-600 font-medium' : undefined}
      title={format(dateObj, 'PPpp')}
    >
      {formatDistanceToNow(dateObj, { addSuffix: true })}
    </span>
  );
};
