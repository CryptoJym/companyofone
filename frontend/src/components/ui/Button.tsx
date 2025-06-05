'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl',
  secondary: 'bg-accent text-white hover:bg-accent-600 focus:ring-accent-400 shadow-lg hover:shadow-xl',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-500 shadow-sm hover:shadow-md',
  ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl'
};

const buttonSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    href,
    external = false,
    className,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'group relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-bounce-in',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'transform hover:scale-105 active:scale-95',
      'overflow-hidden',
      buttonVariants[variant],
      buttonSizes[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-shimmer bg-shimmer opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
        
        <div className="relative z-10 flex items-center justify-center">
          {loading && (
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {!loading && icon && iconPosition === 'left' && (
            <span className="mr-2 transition-transform duration-200 group-hover:translate-x-0.5">
              {icon}
            </span>
          )}
          <span className="transition-all duration-200">
            {children}
          </span>
          {!loading && icon && iconPosition === 'right' && (
            <span className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5">
              {icon}
            </span>
          )}
        </div>
      </>
    );

    if (href && !disabled) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
          >
            {content}
          </a>
        );
      }
      return (
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button'; 