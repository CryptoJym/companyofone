// Analytics and tracking utilities for Company of One
'use client';

import { useEffect } from 'react';

// Types for analytics events
export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_type?: 'solopreneur' | 'freelancer' | 'entrepreneur' | 'student';
  plan_type?: 'free' | 'premium' | 'enterprise';
  signup_date?: string;
  last_active?: string;
  goals?: string[];
}

// Google Analytics 4 configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class Analytics {
  private static instance: Analytics;
  private initialized = false;
  private userId?: string;
  private sessionId: string;
  private userProperties: UserProperties = {};
  private currentPath = '';

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Initialize Google Analytics 4
  async initialize(measurementId: string) {
    if (this.initialized || typeof window === 'undefined') return;

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false, // We'll handle page views manually
      });

      this.initialized = true;
      this.currentPath = window.location.pathname;
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
    if (this.initialized && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
      });
    }
  }

  // Set user properties
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };
    if (this.initialized && window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  // Track page views
  trackPageView(path?: string, title?: string) {
    if (!this.initialized) return;

    const pagePath = path || window.location.pathname;
    
    // Only track if path changed
    if (pagePath === this.currentPath) return;
    this.currentPath = pagePath;

    const pageData = {
      page_title: title || document.title,
      page_location: window.location.origin + pagePath,
      page_path: pagePath,
      session_id: this.sessionId,
      user_id: this.userId,
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', pageData);
    }

    // Custom tracking
    this.sendCustomEvent({
      event_name: 'page_view',
      event_category: 'navigation',
      custom_parameters: pageData,
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized) return;

    const eventData = {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
      ...event.custom_parameters,
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.event_name, eventData);
    }

    // Custom tracking
    this.sendCustomEvent(event);
  }

  // Business-specific tracking methods
  trackGoalCreation(goalType: string, goalValue?: string) {
    this.trackEvent({
      event_name: 'goal_created',
      event_category: 'business_growth',
      event_label: goalType,
      custom_parameters: {
        goal_type: goalType,
        goal_value: goalValue,
      },
    });
  }

  trackContentEngagement(contentType: string, contentId: string, action: string) {
    this.trackEvent({
      event_name: 'content_engagement',
      event_category: 'content',
      event_label: `${contentType}_${action}`,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId,
        action: action,
      },
    });
  }

  trackToolUsage(toolName: string, action: string, duration?: number) {
    this.trackEvent({
      event_name: 'tool_usage',
      event_category: 'tools',
      event_label: `${toolName}_${action}`,
      value: duration,
      custom_parameters: {
        tool_name: toolName,
        action: action,
        duration_seconds: duration,
      },
    });
  }

  trackBusinessMetric(metricName: string, value: number, unit?: string) {
    this.trackEvent({
      event_name: 'business_metric',
      event_category: 'metrics',
      event_label: metricName,
      value: value,
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
        unit: unit,
      },
    });
  }

  trackUserJourney(step: string, funnel: string, success?: boolean) {
    this.trackEvent({
      event_name: 'user_journey',
      event_category: 'funnel',
      event_label: `${funnel}_${step}`,
      custom_parameters: {
        funnel_name: funnel,
        step_name: step,
        success: success,
      },
    });
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number) {
    this.trackEvent({
      event_name: 'performance_metric',
      event_category: 'performance',
      event_label: metricName,
      value: value,
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
      },
    });
  }

  // Auto-track page views
  startAutoTracking() {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.trackPageView();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 0);
    });

    // Listen for pushState/replaceState (SPA navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      setTimeout(() => Analytics.getInstance().trackPageView(), 0);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => Analytics.getInstance().trackPageView(), 0);
    };
  }

  // Send events to custom analytics endpoint
  private async sendCustomEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          session_id: this.sessionId,
          user_id: this.userId,
          user_properties: this.userProperties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          user_agent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Failed to send custom analytics event:', error);
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// React hook for analytics
export function useAnalytics() {
  const analytics = Analytics.getInstance();

  useEffect(() => {
    // Initialize analytics on mount
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (measurementId) {
      analytics.initialize(measurementId);
      analytics.startAutoTracking();
    }
  }, []);

  return analytics;
}

// Export singleton instance
export const analytics = Analytics.getInstance();

// Utility functions for common tracking scenarios
export const trackClick = (elementName: string, location: string) => {
  analytics.trackEvent({
    event_name: 'click',
    event_category: 'interaction',
    event_label: `${elementName}_${location}`,
    custom_parameters: {
      element_name: elementName,
      location: location,
    },
  });
};

export const trackFormSubmission = (formName: string, success: boolean) => {
  analytics.trackEvent({
    event_name: 'form_submit',
    event_category: 'form',
    event_label: formName,
    custom_parameters: {
      form_name: formName,
      success: success,
    },
  });
};

export const trackSearch = (query: string, resultCount: number) => {
  analytics.trackEvent({
    event_name: 'search',
    event_category: 'search',
    event_label: query,
    value: resultCount,
    custom_parameters: {
      search_query: query,
      result_count: resultCount,
    },
  });
};

export const trackDownload = (fileName: string, fileType: string) => {
  analytics.trackEvent({
    event_name: 'download',
    event_category: 'content',
    event_label: `${fileType}_download`,
    custom_parameters: {
      file_name: fileName,
      file_type: fileType,
    },
  });
};