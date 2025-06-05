'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  faqs: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({
  title = 'Frequently Asked Questions',
  faqs,
  className,
  ...props
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 last:mb-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex justify-between items-center">
                  <Heading as="h3" size="lg" className="pr-8">
                    {faq.question}
                  </Heading>
                  <svg
                    className={cn(
                      'w-6 h-6 text-gray-500 transition-transform flex-shrink-0',
                      openIndex === index && 'transform rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 bg-white rounded-b-lg -mt-2">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};