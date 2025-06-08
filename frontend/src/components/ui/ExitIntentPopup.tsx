'use client';

import React, { useEffect, useState } from 'react';
import { useConversionOptimization, ExitIntentConfig } from '@/lib/conversion-optimization';
import { Button } from './Button';

interface ExitIntentPopupProps {
  config?: ExitIntentConfig;
  onClose?: () => void;
  onConversion?: () => void;
}

export function ExitIntentPopup({ config, onClose, onConversion }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState<ExitIntentConfig['popup_config'] | null>(null);
  const conversionOptimizer = useConversionOptimization();

  useEffect(() => {
    const handleExitIntent = (event: CustomEvent) => {
      setPopupConfig(event.detail.config);
      setIsVisible(true);
    };

    window.addEventListener('exitIntentTriggered', handleExitIntent as EventListener);
    return () => window.removeEventListener('exitIntentTriggered', handleExitIntent as EventListener);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    conversionOptimizer.trackExitIntentConversion('dismissed');
    onClose?.();
  };

  const handleEngage = () => {
    conversionOptimizer.trackExitIntentConversion('engaged');
    // Don't close yet, let the user interact
  };

  const handleConvert = () => {
    setIsVisible(false);
    conversionOptimizer.trackExitIntentConversion('converted');
    onConversion?.();
  };

  if (!isVisible || !popupConfig) return null;

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative animate-scale-in">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {popupConfig.title}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {popupConfig.message}
            </p>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                href={popupConfig.cta_link}
                onClick={handleConvert}
                onMouseEnter={handleEngage}
              >
                {popupConfig.cta_text}
              </Button>
              
              <button
                onClick={handleDismiss}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                No thanks, I'll continue browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBanner = () => (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold">{popupConfig.title}</h4>
            <p className="text-blue-100 text-sm">{popupConfig.message}</p>
          </div>
          
          <div className="flex items-center space-x-3 ml-4">
            <Button
              variant="secondary"
              size="sm"
              href={popupConfig.cta_link}
              onClick={handleConvert}
              onMouseEnter={handleEngage}
            >
              {popupConfig.cta_text}
            </Button>
            
            <button
              onClick={handleDismiss}
              className="text-blue-100 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSlideIn = () => (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm z-50 animate-slide-in-right">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-900">
            {popupConfig.title}
          </h4>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {popupConfig.message}
        </p>
        
        <div className="space-y-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            href={popupConfig.cta_link}
            onClick={handleConvert}
            onMouseEnter={handleEngage}
          >
            {popupConfig.cta_text}
          </Button>
          
          <button
            onClick={handleDismiss}
            className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors py-1"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );

  switch (popupConfig.design_variant) {
    case 'banner':
      return renderBanner();
    case 'slide-in':
      return renderSlideIn();
    case 'modal':
    default:
      return renderModal();
  }
}

// Exit Intent Provider Component
interface ExitIntentProviderProps {
  children: React.ReactNode;
  config: ExitIntentConfig;
}

export function ExitIntentProvider({ children, config }: ExitIntentProviderProps) {
  const conversionOptimizer = useConversionOptimization();

  useEffect(() => {
    conversionOptimizer.configureExitIntent(config);
  }, [config, conversionOptimizer]);

  return (
    <>
      {children}
      <ExitIntentPopup />
    </>
  );
}

// Predefined exit intent configurations
export const exitIntentConfigs = {
  newsletter: {
    enabled: true,
    sensitivity: 5,
    delay: 1000,
    max_shows_per_session: 1,
    pages: ['*'],
    popup_config: {
      title: "Don't Miss Out!",
      message: "Get our best solopreneur tips delivered straight to your inbox.",
      cta_text: "Subscribe Now",
      cta_link: "/newsletter",
      design_variant: 'modal' as const,
    },
  },
  
  freeGuide: {
    enabled: true,
    sensitivity: 3,
    delay: 500,
    max_shows_per_session: 1,
    pages: ['/blog', '/tools'],
    popup_config: {
      title: "Free Guide: 10 Steps to Solopreneur Success",
      message: "Download our comprehensive guide before you go!",
      cta_text: "Get Free Guide",
      cta_link: "/free-guide",
      design_variant: 'slide-in' as const,
    },
  },
  
  specialOffer: {
    enabled: true,
    sensitivity: 4,
    delay: 1500,
    max_shows_per_session: 2,
    pages: ['/pricing', '/tools'],
    popup_config: {
      title: "Limited Time: 50% Off!",
      message: "Don't miss our biggest sale of the year. Upgrade now and save.",
      cta_text: "Claim Discount",
      cta_link: "/pricing?discount=50",
      design_variant: 'banner' as const,
    },
  },
} as const;