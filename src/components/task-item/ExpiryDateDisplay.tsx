
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface ExpiryDateDisplayProps {
  expiryDate: Date | string;
}

export function ExpiryDateDisplay({ expiryDate }: ExpiryDateDisplayProps) {
  const formattedDate = typeof expiryDate === 'string' 
    ? format(new Date(expiryDate), 'd MMM HH:mm')
    : format(expiryDate, 'd MMM HH:mm');
  
  return (
    <div className="flex items-center text-sm text-muted-foreground mt-1">
      <Calendar className="h-3.5 w-3.5 mr-1.5" />
      <span>Expires: {formattedDate}</span>
    </div>
  );
}
