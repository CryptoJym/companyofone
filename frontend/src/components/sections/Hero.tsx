'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  badge?: string;
  align?: 'left' | 'center';
  size?: 'md' | 'lg' | 'xl';
}

const heroSizes = {
  md: 'py-16 sm:py-24',
  lg: 'py-24 sm:py-32',
  xl: 'py-32 sm:py-40'
};

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  align = 'center',
  size = 'lg',
  className,
  children,
  ...props
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white',
        heroSizes[size],
        className
      )}
      {...props}
    >
      <Container>
        <div className={cn(
          'relative z-10',
          isCenter && 'text-center mx-auto max-w-4xl'
        )}>
          {badge && (
            <div className={cn(
              'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium',
              'bg-utlyze-blue-100 text-utlyze-blue-800 mb-6'
            )}>
              {badge}
            </div>
          )}

          <Heading
            as="h1"
            size="4xl"
            className={cn(
              'mb-6',
              isCenter ? 'text-center' : 'text-left'
            )}
          >
            {title}
          </Heading>

          {subtitle && (
            <Heading
              as="h2"
              size="2xl"
              weight="normal"
              color="muted"
              className={cn(
                'mb-6',
                isCenter ? 'text-center' : 'text-left'
              )}
            >
              {subtitle}
            </Heading>
          )}

          {description && (
            <p className={cn(
              'text-lg text-utlyze-gray-600 mb-10',
              isCenter ? 'text-center' : 'text-left',
              'max-w-3xl',
              isCenter && 'mx-auto'
            )}>
              {description}
            </p>
          )}

          {(primaryCTA || secondaryCTA) && (
            <div className={cn(
              'flex flex-col sm:flex-row gap-4',
              isCenter ? 'justify-center' : 'justify-start'
            )}>
              {primaryCTA && (
                <Button
                  size="lg"
                  href={primaryCTA.href}
                  onClick={primaryCTA.onClick}
                >
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  variant="outline"
                  size="lg"
                  href={secondaryCTA.href}
                  onClick={secondaryCTA.onClick}
                >
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          )}

          {children}
        </div>
      </Container>
    </div>
  );
}; 