'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Card, CardContent } from '../ui/Card';
import { Heading } from '../ui/Heading';
import { Badge } from '../ui/Badge';
import { useStaggeredAnimation, useScrollAnimation, animationVariants } from '@/lib/useScrollAnimation';

export interface Feature {
  headline: string;
  title: string;
  description: string;
  benefits: string[];
  icon?: React.ReactNode;
}

export interface FeaturesProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

export const Features: React.FC<FeaturesProps> = ({
  title = "Powerful Features",
  subtitle,
  features,
  className,
  ...props
}) => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ delay: 100 });
  const { elementRef: gridRef, visibleItems } = useStaggeredAnimation(features.length, { 
    delay: 300,
    staggerDelay: 150 
  });

  return (
    <section 
      className={cn('py-24 bg-gray-50 relative overflow-hidden', className)}
      {...props}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <Container>
        <div 
          ref={headerRef}
          className={cn(
            'text-center mb-16',
            headerVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp
          )}
        >
          <Badge variant="primary" size="lg" className="mb-4">
            Features
          </Badge>
          <Heading as="h2" size="3xl" className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="elevated"
              hoverable={true}
              animated={false} // We're handling animation manually
              className={cn(
                'group transition-all duration-500 ease-out',
                visibleItems[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              )}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      {feature.icon || (
                        <svg 
                          className="w-6 h-6 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13 10V3L4 14h7v7l9-11h-7z" 
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" size="sm" className="mb-3">
                      {feature.headline}
                    </Badge>
                    
                    <Heading as="h3" size="xl" className="mb-3 group-hover:text-primary-600 transition-colors duration-200">
                      {feature.title}
                    </Heading>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Benefits */}
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li 
                          key={benefitIndex}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <svg 
                              className="w-3 h-3 text-primary-600" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          </div>
                          <span className="group-hover:text-gray-900 transition-colors duration-200">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};