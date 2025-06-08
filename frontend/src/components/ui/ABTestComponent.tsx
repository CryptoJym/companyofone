'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useConversionOptimization, ABTest, ABVariation } from '@/lib/conversion-optimization';

interface ABTestComponentProps {
  testId: string;
  children: {
    [variationId: string]: ReactNode;
  };
  fallback?: ReactNode;
  onVariationAssigned?: (variation: ABVariation) => void;
}

export function ABTestComponent({ 
  testId, 
  children, 
  fallback, 
  onVariationAssigned 
}: ABTestComponentProps) {
  const conversionOptimizer = useConversionOptimization();
  const [variation, setVariation] = useState<ABVariation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignedVariation = conversionOptimizer.getVariation(testId);
    setVariation(assignedVariation);
    setLoading(false);

    if (assignedVariation && onVariationAssigned) {
      onVariationAssigned(assignedVariation);
    }
  }, [testId, conversionOptimizer, onVariationAssigned]);

  if (loading) {
    return fallback || null;
  }

  if (!variation) {
    // User not in test, show control or fallback
    return (children.control as ReactNode) || fallback || null;
  }

  return children[variation.id] as ReactNode || fallback || null;
}

interface ABTestButtonProps {
  testId: string;
  variations: {
    [variationId: string]: {
      text: string;
      className?: string;
      onClick?: () => void;
    };
  };
  baseClassName?: string;
  conversionGoal?: string;
}

export function ABTestButton({ 
  testId, 
  variations, 
  baseClassName = '', 
  conversionGoal = 'button_click' 
}: ABTestButtonProps) {
  const conversionOptimizer = useConversionOptimization();
  const [variation, setVariation] = useState<ABVariation | null>(null);

  useEffect(() => {
    const assignedVariation = conversionOptimizer.getVariation(testId);
    setVariation(assignedVariation);
  }, [testId, conversionOptimizer]);

  const handleClick = () => {
    if (variation) {
      const variationConfig = variations[variation.id];
      if (variationConfig?.onClick) {
        variationConfig.onClick();
      }
      conversionOptimizer.trackConversion(testId, conversionGoal);
    }
  };

  if (!variation || !variations[variation.id]) {
    // Default to control variation
    const controlVariation = variations.control;
    if (!controlVariation) return null;

    return (
      <button
        className={`${baseClassName} ${controlVariation.className || ''}`}
        onClick={controlVariation.onClick}
      >
        {controlVariation.text}
      </button>
    );
  }

  const currentVariation = variations[variation.id];
  
  return (
    <button
      className={`${baseClassName} ${currentVariation.className || ''}`}
      onClick={handleClick}
    >
      {currentVariation.text}
    </button>
  );
}

interface ABTestSectionProps {
  testId: string;
  variations: {
    [variationId: string]: {
      title?: string;
      content: ReactNode;
      className?: string;
    };
  };
  containerClassName?: string;
}

export function ABTestSection({ 
  testId, 
  variations, 
  containerClassName = '' 
}: ABTestSectionProps) {
  const conversionOptimizer = useConversionOptimization();
  const [variation, setVariation] = useState<ABVariation | null>(null);

  useEffect(() => {
    const assignedVariation = conversionOptimizer.getVariation(testId);
    setVariation(assignedVariation);
  }, [testId, conversionOptimizer]);

  if (!variation || !variations[variation.id]) {
    // Default to control variation
    const controlVariation = variations.control;
    if (!controlVariation) return null;

    return (
      <div className={`${containerClassName} ${controlVariation.className || ''}`}>
        {controlVariation.title && (
          <h3 className="text-lg font-semibold mb-4">{controlVariation.title}</h3>
        )}
        {controlVariation.content}
      </div>
    );
  }

  const currentVariation = variations[variation.id];
  
  return (
    <div className={`${containerClassName} ${currentVariation.className || ''}`}>
      {currentVariation.title && (
        <h3 className="text-lg font-semibold mb-4">{currentVariation.title}</h3>
      )}
      {currentVariation.content}
    </div>
  );
}

// Hook for manual A/B test management
export function useABTest(testId: string) {
  const conversionOptimizer = useConversionOptimization();
  const [variation, setVariation] = useState<ABVariation | null>(null);

  useEffect(() => {
    const assignedVariation = conversionOptimizer.getVariation(testId);
    setVariation(assignedVariation);
  }, [testId, conversionOptimizer]);

  const trackConversion = (goal?: string, value?: number) => {
    conversionOptimizer.trackConversion(testId, goal || 'conversion', value);
  };

  return {
    variation,
    isInTest: !!variation,
    variationId: variation?.id,
    variationConfig: variation?.config,
    trackConversion,
  };
}