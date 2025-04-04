
import { format } from 'date-fns';

interface ExpiryDateDisplayProps {
  expiryDate: Date;
  className?: string;
}

export function ExpiryDateDisplay({ expiryDate, className }: ExpiryDateDisplayProps) {
  return (
    <span className={`text-xs sm:text-sm ${className || ''}`}>
      Expires: {format(expiryDate, "d MMM HH:mm")}
    </span>
  );
}
