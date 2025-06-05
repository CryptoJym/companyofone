'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Card, CardContent } from '../ui/Card';

export interface Feature {
  headline: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface FeaturesProps extends React.HTMLAttributes<HTMLDivElement> {
  features: Feature[];
}

export const Features: React.FC<FeaturesProps> = ({
  features,
  className,
  ...props
}) => {
  return (
    <Section className={cn('bg-gray-50', className)} {...props}>
      <Container>
        <div className="space-y-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                'flex flex-col md:flex-row gap-8 md:gap-12 items-center',
                index % 2 === 1 && 'md:flex-row-reverse'
              )}
            >
              <div className="flex-1 space-y-4">
                <Heading as="h3" size="2xl" className="text-primary-600">
                  {feature.headline}
                </Heading>
                <Heading as="h4" size="xl" className="text-gray-900">
                  {feature.title}
                </Heading>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3 mt-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-3">
                      <svg 
                        className="w-6 h-6 text-primary-500 mt-0.5 flex-shrink-0" 
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
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1">
                <Card className="shadow-xl h-64 bg-gradient-to-br from-primary-100 to-primary-200 border-0">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-primary-600 text-6xl font-bold">
                      {index + 1}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};