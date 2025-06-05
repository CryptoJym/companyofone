'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Heading } from '../ui/Heading';
import { ConsultationForm } from '../forms/ConsultationForm';

export interface ConsultationSectionProps {
  className?: string;
}

export const ConsultationSection = ({ className }: ConsultationSectionProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <Section 
      id="consultation" 
      className={cn('bg-gradient-to-br from-blue-50 to-indigo-100', className)}
    >
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <Heading as="h2" size="3xl" className="mb-6">
            Get Your Free Business Consultation
          </Heading>
          
          <p className="text-xl text-gray-700 mb-8">
            Discover exactly how to scale your business without scaling your team. 
            Get a personalized roadmap and actionable insights in a free 30-minute consultation.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-left space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                What You'll Get:
              </h3>
              
              <ul className="space-y-4">
                {[
                  "Personalized business assessment",
                  "Custom growth roadmap for your industry",
                  "Automation opportunities analysis", 
                  "Revenue optimization strategies",
                  "Free implementation guide worth $500"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      ✓
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-600 font-semibold">⚡ Limited Time</span>
                </div>
                <p className="text-yellow-800 text-sm">
                  Only 7 consultation spots available this week. 
                  Book now to secure your free session.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <ConsultationForm 
                onSuccess={() => {
                  // Optional: Add analytics tracking here
                  console.log('Consultation form submitted successfully');
                }}
                onError={(error) => {
                  console.error('Consultation form error:', error);
                }}
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🔒", text: "Completely Free" },
              { icon: "⏱️", text: "30 Minutes" },
              { icon: "💯", text: "No Sales Pitch" },
              { icon: "🎯", text: "100% Actionable" }
            ].map((badge, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-sm text-gray-600 font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};