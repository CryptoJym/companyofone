'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Grid } from '../layout/Grid';
import { Card, CardContent } from '../ui/Card';

export interface PainPoint {
  headline: string;
  description: string;
}

export interface PainPointsProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  painPoints: PainPoint[];
}

export const PainPoints: React.FC<PainPointsProps> = ({
  title,
  painPoints,
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

        <Grid cols={1} md={2} gap="lg">
          {painPoints.map((point, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <Heading 
                  as="h3" 
                  size="xl" 
                  className="mb-4 text-gray-900"
                >
                  {point.headline}
                </Heading>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};