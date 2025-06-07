'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  pulse?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  primary: 'bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200 hover:shadow-primary/20',
  accent: 'bg-accent-100 text-accent-800 border-accent-200 hover:bg-accent-200 hover:shadow-accent/20',
  success: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
};

const badgeSizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  animated = true,
  pulse = false,
  glow = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full border transition-all duration-300 ease-out',
        'transform hover:scale-105 active:scale-95',
        badgeVariants[variant as keyof typeof badgeVariants],
        badgeSizes[size as keyof typeof badgeSizes],
        animated && 'animate-fade-in',
        pulse && 'animate-pulse-soft',
        glow && 'shadow-lg hover:shadow-xl',
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="w-2 h-2 bg-current rounded-full mr-2 opacity-75 animate-pulse" />
      )}
      <span className="relative z-10">
        {children}
      </span>
      {glow && variant !== 'default' && (
        <div className="absolute inset-0 rounded-full bg-current opacity-0 hover:opacity-10 transition-opacity duration-300" />
      )}
    </div>
  );
}; 