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
  // New enhanced variants
  fadeInUpBounce: 'opacity-0 translate-y-12 transition-all duration-800 ease-bounce-in',
  fadeInUpBounceVisible: 'opacity-100 translate-y-0',
  scaleInBounce: 'opacity-0 scale-90 transition-all duration-700 ease-bounce-in',
  scaleInBounceVisible: 'opacity-100 scale-100',
  slideInFromBottom: 'opacity-0 translate-y-16 transition-all duration-900 ease-out',
  slideInFromBottomVisible: 'opacity-100 translate-y-0',
  flipIn: 'opacity-0 rotateY-90 perspective-1000 transition-all duration-700 ease-out',
  flipInVisible: 'opacity-100 rotateY-0',
  zoomIn: 'opacity-0 scale-75 transition-all duration-500 ease-out',
  zoomInVisible: 'opacity-100 scale-100',
  blurIn: 'opacity-0 blur-sm transition-all duration-600 ease-out',
  blurInVisible: 'opacity-100 blur-0',
};

// New hooks for advanced animations
export const useParallaxScroll = (speed: number = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        setOffsetY(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { elementRef, offsetY };
};

export const useCountUp = (
  endValue: number,
  duration: number = 2000,
  startOnVisible: boolean = true
) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: true });

  useEffect(() => {
    if ((startOnVisible && isVisible) || (!startOnVisible && !isAnimating)) {
      setIsAnimating(true);
      let startTime: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCurrentValue(Math.floor(endValue * easeOut));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, endValue, duration, startOnVisible, isAnimating]);

  return { elementRef, currentValue, isAnimating };
};

export const useMouseParallax = (intensity: number = 0.1) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * intensity;
        const deltaY = (e.clientY - centerY) * intensity;
        
        setPosition({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return { elementRef, position };
};