'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { Card, CardContent } from '../ui/Card';
import { Grid } from '../layout/Grid';

export interface Testimonial {
  quote: string;
  name: string;
  business: string;
  result: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SocialProofProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  testimonials: Testimonial[];
  stats: Stat[];
}

export const SocialProof: React.FC<SocialProofProps> = ({
  title,
  testimonials,
  stats,
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

        <Grid cols={1} md={3} gap="lg" className="mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg className="w-10 h-10 text-primary-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                  <p className="text-sm font-medium text-primary-600 mt-2">
                    {testimonial.result}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold text-primary-600">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-gray-600 mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};