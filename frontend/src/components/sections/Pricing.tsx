'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heading } from '../ui/Heading';
import { Badge } from '../ui/Badge';
import { useStaggeredAnimation, useScrollAnimation, animationVariants } from '@/lib/useScrollAnimation';

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: {
    text: string;
    href: string;
  };
}

export interface PricingProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  guarantee?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  title = "Simple, Transparent Pricing",
  subtitle,
  plans,
  guarantee,
  className,
  ...props
}) => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ delay: 100 });
  const { elementRef: gridRef, visibleItems } = useStaggeredAnimation(plans.length, { 
    delay: 300,
    staggerDelay: 200 
  });
  const { elementRef: guaranteeRef, isVisible: guaranteeVisible } = useScrollAnimation({ delay: 600 });

  return (
    <section 
      className={cn('py-24 bg-white relative overflow-hidden', className)}
      {...props}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-accent-100 to-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
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
            Pricing
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => {
            const isHighlighted = plan.highlighted;
            
            return (
              <Card
                key={index}
                variant={isHighlighted ? "elevated" : "default"}
                hoverable={true}
                animated={false} // We're handling animation manually
                className={cn(
                  'relative group transition-all duration-500 ease-out',
                  isHighlighted && [
                    'ring-2 ring-primary-500 scale-105',
                    'bg-gradient-to-br from-white to-primary-50'
                  ],
                  visibleItems[index] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                )}
              >
                {/* Highlighted badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" size="md" className="shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <Heading as="h3" size="xl" className="mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {plan.name}
                  </Heading>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
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
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={isHighlighted ? "primary" : "outline"}
                    size="lg"
                    fullWidth
                    href={plan.cta?.href}
                    className="group/btn"
                    icon={
                      <svg 
                        className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    {plan.cta?.text || 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {guarantee && (
          <div 
            ref={guaranteeRef}
            className={cn(
              'text-center max-w-2xl mx-auto',
              guaranteeVisible ? animationVariants.fadeInUpVisible : animationVariants.fadeInUp
            )}
          >
            <div className="bg-gradient-to-r from-green-50 to-primary-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 font-medium">
                {guarantee}
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};