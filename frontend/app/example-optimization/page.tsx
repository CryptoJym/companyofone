'use client';

import React, { useEffect } from 'react';
import { useConversionOptimization, createABTest } from '@/lib/conversion-optimization';
import { ABTestButton, ABTestSection, useABTest } from '@/components/ui/ABTestComponent';
import { HeatmapVisualization, useHeatmapVisualization } from '@/components/ui/HeatmapVisualization';
import { ExitIntentProvider, exitIntentConfigs } from '@/components/ui/ExitIntentPopup';
import { Button } from '@/components/ui/Button';

// Define A/B tests for this page
const heroTest = createABTest({
  name: 'Landing Page Hero Test',
  status: 'running',
  traffic_allocation: 100,
  conversion_goal: 'email_signup',
  variations: [
    {
      id: 'control',
      name: 'Original Hero',
      weight: 50,
      config: {
        headline: 'Build Your Solo Business Empire',
        subheadline: 'Join 10,000+ solopreneurs who are scaling their businesses with our proven strategies.',
        ctaText: 'Get Started Free',
        bgColor: 'blue'
      }
    },
    {
      id: 'variant_a',
      name: 'Urgency-Focused Hero',
      weight: 50,
      config: {
        headline: 'Stop Struggling Alone - Build Your Empire',
        subheadline: 'Limited spots available: Join our exclusive community of successful solopreneurs today.',
        ctaText: 'Claim Your Spot',
        bgColor: 'purple'
      }
    }
  ]
});

function OptimizationExamplePage() {
  const conversionOptimizer = useConversionOptimization();
  const heatmapState = useHeatmapVisualization();
  const { variation: heroVariation, trackConversion } = useABTest('landing_page_hero');

  useEffect(() => {
    // Configure exit intent for this page
    conversionOptimizer.configureExitIntent({
      enabled: true,
      sensitivity: 4,
      delay: 1500,
      max_shows_per_session: 1,
      pages: ['/example-optimization'],
      popup_config: {
        title: "Wait! Don't Miss Out!",
        message: "Get our free solopreneur success guide before you go.",
        cta_text: "Download Free Guide",
        cta_link: "/free-guide",
        design_variant: 'modal',
      },
    });
  }, [conversionOptimizer]);

  const handleEmailSignup = (email: string) => {
    // Simulate email signup
    console.log('Email signup:', email);
    
    // Track conversion for A/B test
    trackConversion('email_signup');
    
    // Track business metric
    conversionOptimizer.trackBusinessMetric('email_signups', 1);
    
    alert('Thanks for signing up! Check your email for next steps.');
  };

  const handleToolClick = (toolName: string) => {
    conversionOptimizer.trackToolUsage(toolName, 'clicked');
  };

  return (
    <ExitIntentProvider config={exitIntentConfigs.freeGuide}>
      <div className="min-h-screen bg-gray-50">
        {/* Debug Panel (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-xs">
            <h3 className="font-semibold text-sm mb-2">Debug Panel</h3>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Hero Variation:</strong> {heroVariation?.name || 'Control'}
              </div>
              <div>
                <strong>Heatmap:</strong> {heatmapState.enabled ? 'On' : 'Off'}
              </div>
              <button
                onClick={() => heatmapState.setEnabled(!heatmapState.enabled)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Toggle Heatmap
              </button>
            </div>
          </div>
        )}

        {/* Hero Section - A/B Tested */}
        <ABTestSection
          testId="landing_page_hero"
          containerClassName="relative overflow-hidden"
          variations={{
            control: {
              content: (
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                      Build Your Solo Business Empire
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                      Join 10,000+ solopreneurs who are scaling their businesses with our proven strategies.
                    </p>
                    <EmailSignupForm onSubmit={handleEmailSignup} buttonText="Get Started Free" />
                  </div>
                </div>
              )
            },
            variant_a: {
              content: (
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                      Stop Struggling Alone - Build Your Empire
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                      Limited spots available: Join our exclusive community of successful solopreneurs today.
                    </p>
                    <EmailSignupForm onSubmit={handleEmailSignup} buttonText="Claim Your Spot" urgent />
                  </div>
                </div>
              )
            }
          }}
        />

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Succeed
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Business Planning Tool',
                  description: 'Create comprehensive business plans in minutes',
                  icon: '📋'
                },
                {
                  name: 'Revenue Tracker',
                  description: 'Monitor your income and growth metrics',
                  icon: '📈'
                },
                {
                  name: 'Community Access',
                  description: 'Connect with successful solopreneurs',
                  icon: '👥'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleToolClick(feature.name)}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Join Thousands of Successful Solopreneurs
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { metric: '10,000+', label: 'Active Members' },
                { metric: '$2.5M+', label: 'Revenue Generated' },
                { metric: '95%', label: 'Success Rate' }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.metric}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't wait another day to build the business of your dreams.
            </p>
            
            <ABTestButton
              testId="final_cta_test"
              conversionGoal="email_signup"
              baseClassName="px-8 py-4 text-lg font-semibold rounded-lg transition-all"
              variations={{
                control: {
                  text: 'Start Building Today',
                  className: 'bg-blue-600 hover:bg-blue-700 text-white',
                  onClick: () => {
                    document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' });
                  }
                },
                variant_a: {
                  text: 'Get Instant Access',
                  className: 'bg-green-600 hover:bg-green-700 text-white',
                  onClick: () => {
                    document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Heatmap Visualization Overlay */}
        <HeatmapVisualization
          enabled={heatmapState.enabled}
          showClicks={heatmapState.showClicks}
          showScrollDepth={heatmapState.showScrollDepth}
          opacity={heatmapState.opacity}
        />
      </div>
    </ExitIntentProvider>
  );
}

// Email signup form component
interface EmailSignupFormProps {
  onSubmit: (email: string) => void;
  buttonText: string;
  urgent?: boolean;
}

function EmailSignupForm({ onSubmit, buttonText, urgent = false }: EmailSignupFormProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <div id="email-form" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <Button
          type="submit"
          variant={urgent ? "danger" : "secondary"}
          size="lg"
          className={`whitespace-nowrap ${urgent ? 'animate-pulse' : ''}`}
        >
          {buttonText}
        </Button>
      </form>
      {urgent && (
        <p className="text-sm mt-2 opacity-90">
          ⚡ Limited time offer - Only 50 spots remaining!
        </p>
      )}
    </div>
  );
}

export default OptimizationExamplePage;