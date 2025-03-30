import React from 'react';

type GreenScoreCircleProps = {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const GreenScoreCircle: React.FC<GreenScoreCircleProps> = ({
  score,
  maxScore = 100,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  
  // Calculate circumference
  const radius = 15.9;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke-dasharray value
  const dashOffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };
  
  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle 
          cx="18" 
          cy="18" 
          r={radius} 
          fill="none" 
          stroke="#E8F5E9" 
          strokeWidth="2.8" 
        />
        
        {/* Progress circle */}
        <circle 
          cx="18" 
          cy="18" 
          r={radius} 
          fill="none" 
          stroke="#4CAF50" 
          strokeWidth="2.8" 
          strokeDasharray={circumference} 
          strokeDashoffset={dashOffset}
          transform="rotate(-90 18 18)"
        />
        
        {/* Text in the middle */}
        <text 
          x="18" 
          y="18" 
          textAnchor="middle" 
          dominantBaseline="central"
          fontWeight="bold"
          fill="#212121"
          style={{
            fontSize: size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px',
          }}
        >
          {score}/{maxScore}
        </text>
      </svg>
    </div>
  );
};

export default GreenScoreCircle;
