'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation, animationVariants } from '@/lib/useScrollAnimation';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  animated?: boolean;
  delay?: number;
  children: React.ReactNode;
}

const cardVariants: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-transparent border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border-0',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20'
};

const cardSizes: Record<NonNullable<CardProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg'
};

const cardPadding: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size,
  padding = 'md',
  hoverable = true,
  animated = true,
  delay = 0,
  className,
  children,
  ...props
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ 
    delay: animated ? delay : 0,
    triggerOnce: true 
  });

  return (
    <div
      ref={animated ? elementRef : null}
      className={cn(
        'rounded-xl transition-all duration-300 ease-out group relative',
        cardVariants[variant as keyof typeof cardVariants],
        cardPadding[padding as keyof typeof cardPadding],
        size && cardSizes[size as keyof typeof cardSizes],
        hoverable && [
          'hover:shadow-xl hover:-translate-y-1',
          'cursor-pointer',
          variant === 'glass' && 'hover:bg-white/90',
          variant === 'elevated' && 'hover:shadow-2xl',
          variant === 'outlined' && 'hover:border-primary hover:shadow-lg',
        ],
        animated && (isVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp),
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay on hover */}
      {hoverable && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-accent-50/0 group-hover:from-primary-50/30 group-hover:to-accent-50/20 rounded-xl transition-all duration-300 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('mt-6 pt-4 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  );
}; 