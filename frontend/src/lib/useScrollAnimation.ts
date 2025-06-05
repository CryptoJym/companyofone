'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  return {
    elementRef,
    isVisible,
    hasAnimated,
  };
};

// Hook for staggered animations
export const useStaggeredAnimation = (
  itemCount: number,
  options: ScrollAnimationOptions & { staggerDelay?: number } = {}
) => {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const { elementRef, isVisible } = useScrollAnimation(scrollOptions);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  useEffect(() => {
    if (isVisible) {
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems((prev: boolean[]) => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * staggerDelay);
        
        timeouts.push(timeout);
      }

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isVisible, itemCount, staggerDelay]);

  return {
    elementRef,
    isVisible,
    visibleItems,
  };
};

// Animation variants for common use cases
export const animationVariants = {
  fadeInUp: 'opacity-0 translate-y-8 transition-all duration-800 ease-out',
  fadeInUpVisible: 'opacity-100 translate-y-0',
  fadeInDown: 'opacity-0 -translate-y-8 transition-all duration-800 ease-out',
  fadeInDownVisible: 'opacity-100 translate-y-0',
  fadeInLeft: 'opacity-0 -translate-x-8 transition-all duration-800 ease-out',
  fadeInLeftVisible: 'opacity-100 translate-x-0',
  fadeInRight: 'opacity-0 translate-x-8 transition-all duration-800 ease-out',
  fadeInRightVisible: 'opacity-100 translate-x-0',
  scaleIn: 'opacity-0 scale-95 transition-all duration-600 ease-out',
  scaleInVisible: 'opacity-100 scale-100',
  slideInUp: 'translate-y-full transition-transform duration-800 ease-out',
  slideInUpVisible: 'translate-y-0',
};