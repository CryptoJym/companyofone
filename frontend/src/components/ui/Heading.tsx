'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  color?: 'default' | 'primary' | 'secondary' | 'white' | 'muted';
  children: React.ReactNode;
}

const headingSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl sm:text-5xl'
};

const headingWeights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

const headingAligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

const headingColors = {
  default: 'text-utlyze-gray-900',
  primary: 'text-utlyze-blue-600',
  secondary: 'text-utlyze-red-500',
  white: 'text-white',
  muted: 'text-utlyze-gray-600'
};

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  size = '2xl',
  weight = 'bold',
  align = 'left',
  color = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'tracking-tight',
        headingSizes[size],
        headingWeights[weight],
        headingAligns[align],
        headingColors[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}; 