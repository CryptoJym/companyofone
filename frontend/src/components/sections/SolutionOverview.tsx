'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Badge } from '../ui/Badge';

export interface Benefit {
  title: string;
  description: string;
}

export interface SolutionOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  tagline: string;
  description: string;
  benefits: Benefit[];
}

export const SolutionOverview: React.FC<SolutionOverviewProps> = ({
  title,
  tagline,
  description,
  benefits,
  className,
  ...props
}) => {
  return (
    <Section className={cn('bg-white', className)} {...props}>
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Heading
            as="h2"
            size="3xl"
            className="mb-4"
          >
            {title}
          </Heading>
          
          <Badge variant="secondary" size="lg" className="mb-8">
            {tagline}
          </Badge>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex gap-4 p-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold text-lg">
                {index + 1}
              </div>
              <div>
                <Heading as="h3" size="lg" className="mb-2">
                  {benefit.title}
                </Heading>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};