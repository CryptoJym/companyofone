'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Button } from '../ui/Button';
import { useStaggeredAnimation, useScrollAnimation, animationVariants, useMouseParallax } from '@/lib/useScrollAnimation';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

export interface FeaturesProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  features: Feature[];
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  animated?: boolean;
}

const FeatureCard: React.FC<{ 
  feature: Feature; 
  index: number; 
  isVisible: boolean;
  totalFeatures: number;
}> = ({ feature, index, isVisible, totalFeatures }) => {
  const { elementRef: cardRef, position } = useMouseParallax(0.05);
  const delay = index * 150; // Stagger delay

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative transition-all duration-700 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        transform: `translate(${position.x}px, ${position.y}px)` 
      }}
    >
      <Card
        hoverable
        className={cn(
          'h-full p-8 relative overflow-hidden',
          'group-hover:shadow-2xl group-hover:-translate-y-2',
          'transition-all duration-500 ease-bounce-in',
          'border-2 border-transparent group-hover:border-primary-200',
          'bg-gradient-to-br from-white to-gray-50 group-hover:from-primary-50 group-hover:to-white'
        )}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-700 ease-out" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1000" style={{ animationDelay: '0ms' }} />
          <div className="absolute top-8 -left-1 w-2 h-2 bg-accent-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1000" style={{ animationDelay: '500ms' }} />
          <div className="absolute -bottom-1 right-8 w-3 h-3 bg-primary-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-1000" style={{ animationDelay: '1000ms' }} />
        </div>

        <div className="relative z-10">
          {/* Icon with enhanced animations */}
          <div className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
            'bg-gradient-to-br from-primary-100 to-primary-200',
            'group-hover:from-primary-200 group-hover:to-primary-300',
            'transition-all duration-500 ease-out',
            'group-hover:scale-110 group-hover:rotate-3',
            'shadow-lg group-hover:shadow-xl group-hover:shadow-primary-200/50'
          )}>
            <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300 group-hover:animate-pulse">
              {feature.icon}
            </div>
          </div>

          {/* Title with typewriter effect on hover */}
          <Heading
            as="h3"
            size="xl"
            className={cn(
              'mb-4 group-hover:text-primary-700 transition-colors duration-300',
              'group-hover:animate-rubber-band'
            )}
          >
            {feature.title}
          </Heading>

          {/* Description with fade-in animation */}
          <p className={cn(
            'text-gray-600 mb-6 leading-relaxed',
            'group-hover:text-gray-700 transition-colors duration-300',
            'opacity-90 group-hover:opacity-100'
          )}>
            {feature.description}
          </p>

          {/* Link with enhanced hover state */}
          {feature.link && (
            <Button
              variant="ghost"
              size="sm"
              href={feature.link.href}
              className={cn(
                'p-0 h-auto font-medium text-primary-600 hover:text-primary-700',
                'group-hover:translate-x-1 transition-transform duration-300',
                'relative overflow-hidden'
              )}
              icon={
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
              iconPosition="right"
            >
              {feature.link.text}
            </Button>
          )}
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </Card>
    </div>
  );
};

export const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  features,
  layout = 'grid',
  columns = 3,
  animated = true,
  className,
  ...props
}) => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ delay: 100 });
  const { elementRef: gridRef, visibleItems } = useStaggeredAnimation(features.length, { 
    delay: 300,
    staggerDelay: 150 
  });

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn('py-24 relative overflow-hidden', className)} {...props}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-primary-50 to-transparent rounded-full opacity-20" />
      </div>

      <Container>
        {(title || subtitle) && (
          <div
            ref={titleRef}
            className={cn(
              'text-center max-w-3xl mx-auto mb-16',
              animated && (titleVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp)
            )}
          >
            {title && (
              <Heading
                as="h2"
                size="3xl"
                className={cn(
                  'mb-6 bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 bg-clip-text text-transparent',
                  titleVisible && 'animate-gradient bg-[length:200%_auto]'
                )}
              >
                {title}
              </Heading>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          ref={gridRef}
          className={cn(
            layout === 'grid' 
              ? `grid grid-cols-1 ${gridCols[columns]} gap-8`
              : 'space-y-8'
          )}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={visibleItems[index]}
              totalFeatures={features.length}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};