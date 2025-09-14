import React from 'react';

interface AlertProps {
  className?: string;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export function Alert({ className = '', variant = 'default', children, ...props }: AlertProps) {
  const baseStyles = 'relative w-full rounded-lg border p-4';

  const variants = {
    default: 'bg-white border-gray-200',
    destructive: 'border-red-200 bg-red-50 text-red-900'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({ className = '', children, ...props }: AlertDescriptionProps) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
}