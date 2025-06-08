'use client';

import { analytics } from './analytics';

// Types for A/B Testing
export interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variations: ABVariation[];
  traffic_allocation: number; // Percentage of traffic to include
  conversion_goal: string;
  start_date?: Date;
  end_date?: Date;
  metadata?: Record<string, any>;
}

export interface ABVariation {
  id: string;
  name: string;
  weight: number; // Percentage allocation
  config: Record<string, any>;
}

export interface ABTestResult {
  variation_id: string;
  test_id: string;
  user_id?: string;
  session_id: string;
  timestamp: Date;
  converted: boolean;
  conversion_value?: number;
}

// Types for Heatmap Data
export interface HeatmapEvent {
  type: 'click' | 'move' | 'scroll' | 'hover';
  x: number;
  y: number;
  timestamp: number;
  page_path: string;
  viewport_width: number;
  viewport_height: number;
  element_selector?: string;
  scroll_depth?: number;
}

// Types for Exit Intent
export interface ExitIntentConfig {
  enabled: boolean;
  sensitivity: number; // Mouse speed threshold
  delay: number; // Delay before showing popup (ms)
  max_shows_per_session: number;
  pages: string[]; // Pages where exit intent is active
  popup_config: {
    title: string;
    message: string;
    cta_text: string;
    cta_link: string;
    design_variant?: 'modal' | 'banner' | 'slide-in';
  };
}

class ConversionOptimizer {
  private static instance: ConversionOptimizer;
  private abTests: Map<string, ABTest> = new Map();
  private userVariations: Map<string, string> = new Map();
  private heatmapData: HeatmapEvent[] = [];
  private exitIntentConfig: ExitIntentConfig | null = null;
  private exitIntentTriggered = false;
  private exitIntentShowCount = 0;
  private lastMouseY = 0;
  private mouseLeaveTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeHeatmapTracking();
      this.initializeExitIntentTracking();
    }
  }

  static getInstance(): ConversionOptimizer {
    if (!ConversionOptimizer.instance) {
      ConversionOptimizer.instance = new ConversionOptimizer();
    }
    return ConversionOptimizer.instance;
  }

  // A/B Testing Methods
  registerABTest(test: ABTest): void {
    this.abTests.set(test.id, test);
    analytics.trackEvent({
      event_name: 'ab_test_registered',
      event_category: 'optimization',
      event_label: test.name,
      custom_parameters: {
        test_id: test.id,
        variations_count: test.variations.length,
        traffic_allocation: test.traffic_allocation,
      },
    });
  }

  getVariation(testId: string, userId?: string): ABVariation | null {
    const test = this.abTests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user should be included in test
    const userKey = userId || this.getUserSessionKey();
    const hash = this.hashString(userKey + testId);
    const userPercent = hash % 100;
    
    if (userPercent >= test.traffic_allocation) {
      return null; // User not in test
    }

    // Check if user already has a variation assigned
    const variationKey = `${testId}_${userKey}`;
    if (this.userVariations.has(variationKey)) {
      const variationId = this.userVariations.get(variationKey)!;
      return test.variations.find(v => v.id === variationId) || null;
    }

    // Assign variation based on weights
    const totalWeight = test.variations.reduce((sum, v) => sum + v.weight, 0);
    const randomValue = hash % totalWeight;
    let weightSum = 0;

    for (const variation of test.variations) {
      weightSum += variation.weight;
      if (randomValue < weightSum) {
        this.userVariations.set(variationKey, variation.id);
        
        // Track assignment
        analytics.trackEvent({
          event_name: 'ab_test_assignment',
          event_category: 'optimization',
          event_label: `${test.name}_${variation.name}`,
          custom_parameters: {
            test_id: testId,
            variation_id: variation.id,
            user_key: userKey,
          },
        });

        return variation;
      }
    }

    return null;
  }

  trackConversion(testId: string, conversionGoal: string, value?: number): void {
    const test = this.abTests.get(testId);
    if (!test) return;

    const userKey = this.getUserSessionKey();
    const variationKey = `${testId}_${userKey}`;
    const variationId = this.userVariations.get(variationKey);

    if (variationId) {
      analytics.trackEvent({
        event_name: 'ab_test_conversion',
        event_category: 'optimization',
        event_label: `${test.name}_${conversionGoal}`,
        value: value,
        custom_parameters: {
          test_id: testId,
          variation_id: variationId,
          conversion_goal: conversionGoal,
          conversion_value: value,
        },
      });
    }
  }

  // Heatmap Methods
  private initializeHeatmapTracking(): void {
    if (typeof window === 'undefined') return;

    // Track clicks
    document.addEventListener('click', (e) => {
      this.recordHeatmapEvent({
        type: 'click',
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        page_path: window.location.pathname,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        element_selector: this.getElementSelector(e.target as Element),
      });
    });

    // Track mouse movements (throttled)
    let mouseMoveTimeout: number;
    document.addEventListener('mousemove', (e) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        this.recordHeatmapEvent({
          type: 'move',
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
          page_path: window.location.pathname,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        });
      }, 100); // Throttle to every 100ms
    });

    // Track scroll events
    let scrollTimeout: number;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        this.recordHeatmapEvent({
          type: 'scroll',
          x: 0,
          y: window.scrollY,
          timestamp: Date.now(),
          page_path: window.location.pathname,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
          scroll_depth: scrollDepth,
        });
      }, 200); // Throttle to every 200ms
    });
  }

  private recordHeatmapEvent(event: HeatmapEvent): void {
    this.heatmapData.push(event);
    
    // Send to analytics periodically to avoid overwhelming the server
    if (this.heatmapData.length >= 50) {
      this.flushHeatmapData();
    }
  }

  flushHeatmapData(): void {
    if (this.heatmapData.length === 0) return;

    analytics.trackEvent({
      event_name: 'heatmap_data',
      event_category: 'optimization',
      custom_parameters: {
        events: [...this.heatmapData],
        page_path: window.location.pathname,
      },
    });

    this.heatmapData = [];
  }

  // Exit Intent Methods
  configureExitIntent(config: ExitIntentConfig): void {
    this.exitIntentConfig = config;
    this.exitIntentTriggered = false;
    this.exitIntentShowCount = 0;
  }

  private initializeExitIntentTracking(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('mouseleave', (e) => {
      this.handleMouseLeave(e);
    });

    document.addEventListener('mouseenter', () => {
      if (this.mouseLeaveTimer) {
        clearTimeout(this.mouseLeaveTimer);
        this.mouseLeaveTimer = null;
      }
    });

    // Track mouse position for upward movement detection
    document.addEventListener('mousemove', (e) => {
      this.lastMouseY = e.clientY;
    });
  }

  private handleMouseLeave(e: MouseEvent): void {
    if (!this.exitIntentConfig || !this.exitIntentConfig.enabled) return;
    if (this.exitIntentTriggered) return;
    if (this.exitIntentShowCount >= this.exitIntentConfig.max_shows_per_session) return;

    // Check if we're on a configured page
    const currentPath = window.location.pathname;
    if (!this.exitIntentConfig.pages.includes(currentPath) && 
        !this.exitIntentConfig.pages.includes('*')) return;

    // Check if mouse moved upward quickly (exit intent)
    const mouseSpeed = Math.abs(e.clientY - this.lastMouseY);
    if (mouseSpeed < this.exitIntentConfig.sensitivity) return;

    // Set timer for popup delay
    this.mouseLeaveTimer = setTimeout(() => {
      this.triggerExitIntent();
    }, this.exitIntentConfig.delay);
  }

  private triggerExitIntent(): void {
    if (!this.exitIntentConfig) return;

    this.exitIntentTriggered = true;
    this.exitIntentShowCount++;

    // Track exit intent trigger
    analytics.trackEvent({
      event_name: 'exit_intent_triggered',
      event_category: 'optimization',
      custom_parameters: {
        page_path: window.location.pathname,
        show_count: this.exitIntentShowCount,
        popup_variant: this.exitIntentConfig.popup_config.design_variant,
      },
    });

    // Dispatch custom event for UI components to handle
    window.dispatchEvent(new CustomEvent('exitIntentTriggered', {
      detail: {
        config: this.exitIntentConfig.popup_config,
        showCount: this.exitIntentShowCount,
      }
    }));
  }

  trackExitIntentConversion(action: 'engaged' | 'converted' | 'dismissed'): void {
    analytics.trackEvent({
      event_name: 'exit_intent_action',
      event_category: 'optimization',
      event_label: action,
      custom_parameters: {
        page_path: window.location.pathname,
        show_count: this.exitIntentShowCount,
      },
    });
  }

  // Utility Methods
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private getUserSessionKey(): string {
    // Use a combination of user agent and screen resolution as pseudo-ID
    return `${navigator.userAgent}_${screen.width}x${screen.height}`;
  }

  private getElementSelector(element: Element): string {
    if (!element) return '';
    
    // Try to build a useful selector
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
    }
    
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    return selector;
  }

  // Cleanup method
  cleanup(): void {
    this.flushHeatmapData();
    if (this.mouseLeaveTimer) {
      clearTimeout(this.mouseLeaveTimer);
    }
  }
}

// React hook for conversion optimization
export function useConversionOptimization() {
  return ConversionOptimizer.getInstance();
}

// Export singleton instance
export const conversionOptimizer = ConversionOptimizer.getInstance();

// Utility functions for easy usage
export const createABTest = (config: Omit<ABTest, 'id'>) => {
  const test: ABTest = {
    ...config,
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  };
  conversionOptimizer.registerABTest(test);
  return test;
};

export const getTestVariation = (testId: string, userId?: string) => {
  return conversionOptimizer.getVariation(testId, userId);
};

export const trackTestConversion = (testId: string, goal: string, value?: number) => {
  conversionOptimizer.trackConversion(testId, goal, value);
};