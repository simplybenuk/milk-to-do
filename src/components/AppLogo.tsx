
import React from 'react';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function AppLogo({ size = 'medium' }: AppLogoProps) {
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

  return (
    <div className={containerClasses[size]}>
      {/* Milk Carton SVG */}
      <svg 
        width={logoSizes[size].width} 
        height={logoSizes[size].height} 
        viewBox="0 0 48 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Carton body */}
        <path 
          d="M8 14L8 56C8 58.2091 9.79086 60 12 60H36C38.2091 60 40 58.2091 40 56V14L34 4H14L8 14Z" 
          fill="#FFFFFF" 
          stroke="#ea384c" 
          strokeWidth="2" 
        />
        
        {/* Carton top */}
        <path 
          d="M8 14H40" 
          stroke="#ea384c" 
          strokeWidth="2" 
        />
        
        {/* Label */}
        <rect 
          x="12" 
          y="22" 
          width="24" 
          height="18" 
          rx="2" 
          fill="#FFDEE2" 
        />
        
        {/* Concerned face */}
        <circle cx="24" cy="31" r="8" fill="#FFFFFF" />
        <ellipse cx="20" cy="29" rx="1.5" ry="2" fill="#8E9196" />
        <ellipse cx="28" cy="29" rx="1.5" ry="2" fill="#8E9196" />
        <path 
          d="M20 36C22 34 26 34 28 36" 
          stroke="#8E9196" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        
        {/* Sweat drop */}
        <path 
          d="M31 27C31 25.3431 29.6569 24 28 24C29.6569 24 31 22.6569 31 21" 
          stroke="#8E9196" 
          strokeWidth="1"
          strokeLinecap="round" 
        />
      </svg>
      
      {/* SourList text */}
      <span className={`${logoTextClasses[size]} font-header text-gradient`}>SourList</span>
    </div>
  );
}
