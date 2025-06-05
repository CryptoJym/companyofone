'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'wave';
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const skeletonVariants = {
  text: 'h-4 rounded',
  circular: 'rounded-full aspect-square',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg'
};

const skeletonAnimations = {
  pulse: 'animate-pulse',
  shimmer: 'animate-shimmer bg-shimmer',
  wave: 'animate-gradient bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  animation = 'shimmer',
  lines = 1,
  width,
  height,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'bg-gray-200',
    skeletonVariants[variant],
    skeletonAnimations[animation],
    className
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={index === lines - 1 ? { ...style, width: '75%' } : style}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} {...props} />;
};

// Preset skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border rounded-xl bg-white', className)}>
    <div className="space-y-4">
      <Skeleton variant="rectangular" height={200} animation="shimmer" />
      <div className="space-y-2">
        <Skeleton variant="text" width="75%" />
        <Skeleton variant="text" lines={3} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={100} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <Skeleton 
      variant="circular" 
      className={cn(sizes[size], className)} 
      animation="shimmer"
    />
  );
};

export const SkeletonButton: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className 
}) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton 
      variant="rounded" 
      className={cn(sizes[size], className)} 
      animation="pulse"
    />
  );
};

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
  width?: string | number;
}> = ({ 
  lines = 3, 
  className,
  width 
}) => (
  <Skeleton 
    variant="text" 
    lines={lines} 
    width={width}
    className={className} 
    animation="shimmer"
  />
);