
import React from 'react';
import { cn } from '@/lib/utils';
import { UpgradeBanner } from '@/components/UpgradeBanner';

interface PageContainerProps {
  inFocusMode: boolean;
  children: React.ReactNode;
}

export function PageContainer({ inFocusMode, children }: PageContainerProps) {
  // Create dynamic page classes based on focus mode state
  const pageClasses = cn(
    "min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-500 ease-in-out flex flex-col",
    inFocusMode ? "bg-gray-900" : "bg-milk-50"
  );

  // Create dynamic text color classes based on focus mode
  const textClasses = cn(
    "mx-auto max-w-3xl transition-colors duration-500 flex-grow",
    inFocusMode && "text-white"
  );

  return (
    <div className={pageClasses}>
      <div className={textClasses}>
        {children}
      </div>
      
      {/* Only show the upgrade banner when not in focus mode */}
      {!inFocusMode && <UpgradeBanner />}
    </div>
  );
}
