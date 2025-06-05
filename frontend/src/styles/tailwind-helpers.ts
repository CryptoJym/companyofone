/**
 * Tailwind CSS configuration helpers for Company of One Design System
 * 
 * These helpers convert our design system tokens to Tailwind-compatible format
 */

import { colors, typography, spacing, borderRadius, shadows, breakpoints } from './design-system';

// Convert our color palette to Tailwind format
export const tailwindColors = {
  primary: colors.primary,
  accent: colors.accent,
  neutral: colors.neutral,
  success: {
    light: colors.success.light,
    DEFAULT: colors.success.DEFAULT,
    dark: colors.success.dark,
  },
  warning: {
    light: colors.warning.light,
    DEFAULT: colors.warning.DEFAULT,
    dark: colors.warning.dark,
  },
  error: {
    light: colors.error.light,
    DEFAULT: colors.error.DEFAULT,
    dark: colors.error.dark,
  },
  info: {
    light: colors.info.light,
    DEFAULT: colors.info.DEFAULT,
    dark: colors.info.dark,
  },
};

// Convert font sizes to Tailwind format with line heights
export const tailwindFontSize = Object.entries(typography.fontSize).reduce((acc, [key, value]) => {
  // Map appropriate line heights to font sizes
  const lineHeightMap: Record<string, number> = {
    xs: typography.lineHeight.tight,
    sm: typography.lineHeight.normal,
    base: typography.lineHeight.normal,
    lg: typography.lineHeight.relaxed,
    xl: typography.lineHeight.relaxed,
    '2xl': typography.lineHeight.snug,
    '3xl': typography.lineHeight.snug,
    '4xl': typography.lineHeight.tight,
    '5xl': typography.lineHeight.tight,
    '6xl': typography.lineHeight.none,
    '7xl': typography.lineHeight.none,
  };
  
  acc[key] = [value, { lineHeight: lineHeightMap[key] || typography.lineHeight.normal }];
  return acc;
}, {} as Record<string, [string, { lineHeight: number }]>);

// Convert spacing to Tailwind format (already compatible)
export const tailwindSpacing = spacing;

// Convert border radius to Tailwind format (already compatible)
export const tailwindBorderRadius = borderRadius;

// Convert shadows to Tailwind format (already compatible)
export const tailwindBoxShadow = shadows;

// Convert breakpoints to Tailwind format (already compatible)
export const tailwindScreens = breakpoints;

// Font families for Tailwind
export const tailwindFontFamily = {
  sans: typography.fontFamily.sans.join(', '),
  serif: typography.fontFamily.serif.join(', '),
  mono: typography.fontFamily.mono.join(', '),
};

// Create extend object for Tailwind config
export const tailwindExtend = {
  colors: tailwindColors,
  fontSize: tailwindFontSize,
  spacing: tailwindSpacing,
  borderRadius: tailwindBorderRadius,
  boxShadow: tailwindBoxShadow,
  screens: tailwindScreens,
  fontFamily: tailwindFontFamily,
  
  // Add custom animations
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideIn: {
      '0%': { transform: 'translateY(100%)' },
      '100%': { transform: 'translateY(0)' },
    },
    slideOut: {
      '0%': { transform: 'translateY(0)' },
      '100%': { transform: 'translateY(100%)' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.9)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
      '0%': { transform: 'scale(1)', opacity: '1' },
      '100%': { transform: 'scale(0.9)', opacity: '0' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
  
  animation: {
    fadeIn: 'fadeIn 200ms ease-out',
    fadeOut: 'fadeOut 200ms ease-in',
    slideIn: 'slideIn 300ms ease-out',
    slideOut: 'slideOut 300ms ease-in',
    scaleIn: 'scaleIn 200ms ease-out',
    scaleOut: 'scaleOut 200ms ease-in',
    bounce: 'bounce 1s ease-in-out infinite',
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
};

// Export a complete Tailwind config object
export const companyOfOneTailwindTheme = {
  extend: tailwindExtend,
};