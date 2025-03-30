import React from 'react';
import logoSvg from '../../assets/leaf-logo.svg';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const EcoSplitLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} overflow-hidden`}>
      <img 
        src={logoSvg} 
        alt="EcoSplit Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default EcoSplitLogo;
