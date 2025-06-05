'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'light' | 'dark' | 'gradient' | 'accent';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const sectionVariants = {
  default: 'bg-white',
  light: 'bg-utlyze-gray-50',
  dark: 'bg-utlyze-gray-900 text-white',
  gradient: 'bg-gradient-to-br from-utlyze-blue-600 to-utlyze-blue-700 text-white',
  accent: 'bg-utlyze-red-50'
};

const sectionSpacing = {
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-24',
  xl: 'py-24 sm:py-32'
};

export const Section: React.FC<SectionProps> = ({
  variant = 'default',
  spacing = 'lg',
  className,
  children,
  ...props
}) => {
  return (
    <section
      className={cn(
        sectionVariants[variant],
        sectionSpacing[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}; 