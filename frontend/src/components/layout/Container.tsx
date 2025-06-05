'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: React.ReactNode;
}

const containerSizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full'
};

export const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        containerSizes[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 