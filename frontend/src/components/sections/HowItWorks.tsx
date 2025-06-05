'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';

export interface Step {
  title: string;
  heading: string;
  description: string;
}

export interface HowItWorksProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  steps: Step[];
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  title,
  steps,
  className,
  ...props
}) => {
  return (
    <Section className={cn('bg-gray-50', className)} {...props}>
      <Container>
        <Heading
          as="h2"
          size="3xl"
          className="text-center mb-16"
        >
          {title}
        </Heading>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-8 mb-12 last:mb-0">
                {/* Step number */}
                <div className="flex-shrink-0 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl relative z-10">
                  {index + 1}
                </div>
                
                {/* Step content */}
                <div className="flex-1 pb-8">
                  <Heading as="h3" size="lg" className="text-primary-600 mb-2">
                    {step.title}
                  </Heading>
                  <Heading as="h4" size="xl" className="mb-4">
                    {step.heading}
                  </Heading>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};