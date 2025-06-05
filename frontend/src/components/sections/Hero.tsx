'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { useScrollAnimation, animationVariants } from '@/lib/useScrollAnimation';

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
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation({ delay: 100 });
  const { elementRef: badgeRef, isVisible: badgeVisible } = useScrollAnimation({ delay: 200 });
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ delay: 300 });
  const { elementRef: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation({ delay: 400 });
  const { elementRef: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation({ delay: 500 });
  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation({ delay: 600 });

  return (
    <div
      ref={heroRef}
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-primary-50',
        heroSizes[size],
        className
      )}
      {...props}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <Container>
        <div className={cn(
          'relative z-10',
          isCenter && 'text-center mx-auto max-w-4xl'
        )}>
          {badge && (
            <div
              ref={badgeRef}
              className={cn(
                'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium mb-6',
                'bg-primary-100 text-primary-800 border border-primary-200',
                'shadow-sm hover:shadow-md transition-all duration-300',
                badgeVisible ? animationVariants.fadeInDownVisible : animationVariants.fadeInDown
              )}
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse-soft" />
              {badge}
            </div>
          )}

          <div
            ref={titleRef}
            className={cn(
              titleVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp
            )}
          >
            <Heading
              as="h1"
              size="4xl"
              className={cn(
                'mb-6 bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent',
                isCenter ? 'text-center' : 'text-left'
              )}
            >
              {title}
            </Heading>
          </div>

          {subtitle && (
            <div
              ref={subtitleRef}
              className={cn(
                subtitleVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp
              )}
            >
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
            </div>
          )}

          {description && (
            <div
              ref={descriptionRef}
              className={cn(
                descriptionVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp
              )}
            >
              <p className={cn(
                'text-lg text-gray-600 mb-10 leading-relaxed',
                isCenter ? 'text-center' : 'text-left',
                'max-w-3xl',
                isCenter && 'mx-auto'
              )}>
                {description}
              </p>
            </div>
          )}

          {(primaryCTA || secondaryCTA) && (
            <div
              ref={ctaRef}
              className={cn(
                'flex flex-col sm:flex-row gap-4',
                isCenter ? 'justify-center' : 'justify-start',
                ctaVisible ? animationVariants.scaleInVisible : animationVariants.scaleIn
              )}
            >
              {primaryCTA && (
                <Button
                  size="lg"
                  href={primaryCTA.href}
                  onClick={primaryCTA.onClick}
                  className="group"
                  icon={
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                  iconPosition="right"
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
                  className="group"
                  icon={
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
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