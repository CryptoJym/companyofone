'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline' | 'filled' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  animated?: boolean;
}

const inputVariants = {
  default: 'border-gray-300 bg-white focus:border-primary-500 focus:ring-primary-500/20',
  outline: 'border-2 border-gray-200 bg-transparent focus:border-primary-500 focus:ring-primary-500/10',
  filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-primary-500/20 focus:shadow-md',
  floating: 'border-b-2 border-gray-300 bg-transparent rounded-none focus:border-primary-500 focus:ring-0'
};

const inputSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg'
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'default',
    size = 'md',
    label,
    error,
    success = false,
    icon,
    iconPosition = 'left',
    loading = false,
    animated = true,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const isFloating = variant === 'floating';
    const showFloatingLabel = isFloating && label && (isFocused || hasValue);

    const inputClasses = cn(
      'w-full rounded-lg transition-all duration-300 ease-out font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400 placeholder:transition-colors',
      inputVariants[variant],
      inputSizes[size],
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50',
      success && !error && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
      loading && 'cursor-wait',
      animated && 'transform hover:scale-[1.02] focus:scale-[1.02]',
      icon && iconPosition === 'left' && 'pl-10',
      icon && iconPosition === 'right' && 'pr-10',
      isFloating && 'pt-6 pb-2',
      className
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {/* Standard label for non-floating variants */}
        {label && !isFloating && (
          <label className={cn(
            'block text-sm font-medium mb-2 transition-colors duration-200',
            error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700',
            isFocused && 'text-primary-600'
          )}>
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <div className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200',
              isFocused && 'text-primary-500',
              error && 'text-red-500',
              success && !error && 'text-green-500'
            )}>
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : icon}
            </div>
          )}

          <input
            ref={ref}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* Floating label */}
          {label && isFloating && (
            <label className={cn(
              'absolute left-4 transition-all duration-300 ease-out pointer-events-none',
              'text-gray-500 origin-left',
              showFloatingLabel
                ? 'top-2 text-xs font-medium scale-90 text-primary-600'
                : 'top-1/2 -translate-y-1/2 text-base',
              error && 'text-red-600',
              success && !error && 'text-green-600'
            )}>
              {label}
            </label>
          )}

          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <div className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200',
              isFocused && 'text-primary-500',
              error && 'text-red-500',
              success && !error && 'text-green-500'
            )}>
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : icon}
            </div>
          )}

          {/* Success/Error icons */}
          {(success || error) && !loading && !icon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {error ? (
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}

          {/* Focus indicator line for floating variant */}
          {isFloating && (
            <div className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-300 ease-out',
              isFocused ? 'w-full' : 'w-0'
            )} />
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component using similar styling
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    const textareaId = props.id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-utlyze-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border transition-colors duration-200',
            'px-3 py-2 text-utlyze-gray-900 placeholder-utlyze-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:bg-utlyze-gray-50 disabled:cursor-not-allowed',
            'resize-y min-h-[100px]',
            {
              'border-utlyze-gray-300 focus:border-utlyze-blue-500 focus:ring-utlyze-blue-500': !error,
              'border-red-500 focus:border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          {...props}
        />
        
        {hint && !error && (
          <p className="mt-1 text-sm text-utlyze-gray-500">{hint}</p>
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea'; 