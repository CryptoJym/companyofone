'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  plans: PricingPlan[];
  guarantee?: string;
}

export const Pricing: React.FC<PricingProps> = ({
  title,
  plans,
  guarantee,
  className,
  ...props
}) => {
  return (
    <Section className={cn('bg-white', className)} {...props}>
      <Container>
        <Heading
          as="h2"
          size="3xl"
          className="text-center mb-16"
        >
          {title}
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={cn(
                'relative hover:shadow-xl transition-shadow',
                plan.highlighted && 'border-primary-500 shadow-xl scale-105'
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center p-8">
                <Heading as="h3" size="xl" className="mb-2">
                  {plan.name}
                </Heading>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="p-8 pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="p-8 pt-0">
                <Button 
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {guarantee && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-green-800 font-medium">{guarantee}</p>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};