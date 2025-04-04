
import React from 'react';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'light';
}

export function AppLogo({ size = 'medium', variant = 'default' }: AppLogoProps) {
  // Set size classes based on the size prop
  const containerClasses = {
    small: 'flex items-center gap-1',
    medium: 'flex items-center gap-2',
    large: 'flex items-center gap-3'
  };
  
  const logoTextClasses = {
    small: 'text-lg font-bold',
    medium: 'text-2xl font-bold',
    large: 'text-3xl font-bold'
  };
  
  const logoSizes = {
    small: { width: 24, height: 32 },
    medium: { width: 32, height: 42 },
    large: { width: 40, height: 52 }
  };

  // Text color class based on variant
  const textColorClass = variant === 'light' ? 'text-white' : 'text-gradient';

  return (
    <div className={containerClasses[size]}>
      {/* Use the new uploaded logo image */}
      <img 
        src="/sourmilk-logo.PNG" 
        alt="SourList Logo" 
        width={logoSizes[size].width} 
        height={logoSizes[size].height}
        className="object-contain"
      />
      
      {/* SourList text */}
      <span className={`${logoTextClasses[size]} font-header ${textColorClass}`}>SourList</span>
    </div>
  );
}
