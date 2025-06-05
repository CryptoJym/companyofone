'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface FinalCTAProps extends React.HTMLAttributes<HTMLDivElement> {
  headline: string;
  subheadline: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryText?: string;
  urgencyElement?: string;
  trustBadges?: Array<{
    icon: string;
    text: string;
  }>;
  finalTagline?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  headline,
  subheadline,
  primaryCTA,
  secondaryText,
  urgencyElement,
  trustBadges,
  finalTagline,
  className,
  ...props
}) => {
  return (
    <Section className={cn('bg-gradient-to-br from-primary-50 to-primary-100', className)} {...props}>
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <Heading
            as="h2"
            size="3xl"
            className="mb-6"
          >
            {headline}
          </Heading>
          
          <p className="text-xl text-gray-700 mb-8">
            {subheadline}
          </p>
          
          <Button
            size="xl"
            href={primaryCTA.href}
            className="mb-4"
          >
            {primaryCTA.text}
          </Button>
          
          {secondaryText && (
            <p className="text-gray-600 mb-4">
              {secondaryText}
            </p>
          )}
          
          {urgencyElement && (
            <Badge variant="warning" size="lg" className="mb-12">
              {urgencyElement}
            </Badge>
          )}
          
          {trustBadges && trustBadges.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-8">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-sm text-gray-600">{badge.text}</span>
                </div>
              ))}
            </div>
          )}
          
          {finalTagline && (
            <p className="text-lg font-semibold text-gray-800 mt-8">
              {finalTagline}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
};