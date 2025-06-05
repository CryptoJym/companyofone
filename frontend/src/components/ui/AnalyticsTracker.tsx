'use client';

import { useEffect } from 'react';
import { useAnalytics, trackClick, trackFormSubmission } from '../../lib/analytics';

// Example component that demonstrates analytics tracking
export function AnalyticsTracker({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();

  useEffect(() => {
    // Set user properties (example)
    analytics.setUserProperties({
      user_type: 'solopreneur',
      plan_type: 'free',
    });

    // Track performance metrics
    if (typeof window !== 'undefined') {
      // Track page load time
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        analytics.trackPerformance('page_load_time', loadTime);
      });

      // Track Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library if available
      }
    }
  }, [analytics]);

  return <>{children}</>;
}

// Example tracked button component
export function TrackedButton({
  children,
  onClick,
  trackingData,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  trackingData: {
    elementName: string;
    location: string;
    category?: string;
  };
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const handleClick = () => {
    // Track the click
    trackClick(trackingData.elementName, trackingData.location);
    
    // Track as custom event if category provided
    if (trackingData.category) {
      const analytics = useAnalytics();
      analytics.trackEvent({
        event_name: 'button_click',
        event_category: trackingData.category,
        event_label: trackingData.elementName,
        custom_parameters: {
          location: trackingData.location,
        },
      });
    }

    // Call original onClick
    if (onClick) {
      onClick();
    }
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
}

// Example tracked form component
export function TrackedForm({
  children,
  onSubmit,
  formName,
  ...props
}: {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
  formName: string;
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const handleSubmit = (event: React.FormEvent) => {
    // Track form submission attempt
    trackFormSubmission(formName, true);

    // Call original onSubmit
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

// Business-specific tracking hooks
export function useBusinessTracking() {
  const analytics = useAnalytics();

  const trackGoalCreation = (goalType: string, goalValue?: string) => {
    analytics.trackGoalCreation(goalType, goalValue);
  };

  const trackToolUsage = (toolName: string, action: string, duration?: number) => {
    analytics.trackToolUsage(toolName, action, duration);
  };

  const trackContentEngagement = (contentType: string, contentId: string, action: string) => {
    analytics.trackContentEngagement(contentType, contentId, action);
  };

  const trackBusinessMetric = (metricName: string, value: number, unit?: string) => {
    analytics.trackBusinessMetric(metricName, value, unit);
  };

  const trackUserJourney = (step: string, funnel: string, success?: boolean) => {
    analytics.trackUserJourney(step, funnel, success);
  };

  return {
    trackGoalCreation,
    trackToolUsage,
    trackContentEngagement,
    trackBusinessMetric,
    trackUserJourney,
  };
}