'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    hint,
    icon,
    iconPosition = 'left',
    className,
    type = 'text',
    ...props 
  }, ref) => {
    const inputId = props.id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-utlyze-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-utlyze-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              'block w-full rounded-lg border transition-colors duration-200',
              'px-3 py-2 text-utlyze-gray-900 placeholder-utlyze-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:bg-utlyze-gray-50 disabled:cursor-not-allowed',
              {
                'border-utlyze-gray-300 focus:border-utlyze-blue-500 focus:ring-utlyze-blue-500': !error,
                'border-red-500 focus:border-red-500 focus:ring-red-500': error,
                'pl-10': icon && iconPosition === 'left',
                'pr-10': icon && iconPosition === 'right',
              },
              className
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-utlyze-gray-400">
              {icon}
            </div>
          )}
        </div>
        
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