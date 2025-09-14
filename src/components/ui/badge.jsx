import React from 'react';

interface BadgeProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-blue-100 text-blue-800',
    secondary: 'border-transparent bg-gray-100 text-gray-800',
    destructive: 'border-transparent bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-900'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}