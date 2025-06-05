/**
 * Company of One Design System
 * 
 * A clean, professional, and trustworthy design system for solopreneurs
 * and very small business owners. Built with Utlyze brand colors.
 */

// ===== COLOR SYSTEM =====
export const colors = {
  // Primary - Utlyze Blue
  primary: {
    50: '#E6F0FF',
    100: '#CCE0FF',
    200: '#99C2FF',
    300: '#66A3FF',
    400: '#3385FF',
    500: '#4169E1', // Main brand color
    600: '#3454B4',
    700: '#283F87',
    800: '#1B2A5A',
    900: '#0E152D',
  },
  
  // Accent - Energetic Red
  accent: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#E74C3C', // Main accent color
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Neutral - Professional Gray
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  
  // Semantic Colors
  success: {
    light: '#10B981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  warning: {
    light: '#F59E0B',
    DEFAULT: '#D97706',
    dark: '#B45309',
  },
  error: {
    light: '#EF4444',
    DEFAULT: '#DC2626',
    dark: '#B91C1C',
  },
  info: {
    light: '#3B82F6',
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    inverse: '#0A0A0A',
  },
  
  // Text Colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
    link: '#4169E1',
    linkHover: '#3454B4',
  },
};

// ===== TYPOGRAPHY SYSTEM =====
export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Georgia', 'Times New Roman', 'serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  // Font Weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ===== SPACING SYSTEM =====
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// ===== SHADOWS =====
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Colored shadows for emphasis
  primary: '0 4px 14px 0 rgba(65, 105, 225, 0.3)',
  accent: '0 4px 14px 0 rgba(231, 76, 60, 0.3)',
};

// ===== Z-INDEX SYSTEM =====
export const zIndex = {
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  dropdown: 1000,
  sticky: 1020,
  modal: 1030,
  popover: 1040,
  tooltip: 1050,
};

// ===== BREAKPOINTS =====
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ===== TRANSITIONS & ANIMATIONS =====
export const transitions = {
  // Durations
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Common transitions
  common: {
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 200ms, border-color 200ms, color 200ms, fill 200ms, stroke 200ms',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ===== COMPONENT VARIANTS =====
export const variants = {
  // Button variants
  button: {
    primary: {
      background: colors.primary[500],
      color: colors.text.inverse,
      hoverBackground: colors.primary[600],
      activeBackground: colors.primary[700],
      focusRing: colors.primary[300],
    },
    secondary: {
      background: colors.neutral[100],
      color: colors.text.primary,
      hoverBackground: colors.neutral[200],
      activeBackground: colors.neutral[300],
      focusRing: colors.neutral[400],
    },
    accent: {
      background: colors.accent[500],
      color: colors.text.inverse,
      hoverBackground: colors.accent[600],
      activeBackground: colors.accent[700],
      focusRing: colors.accent[300],
    },
    ghost: {
      background: 'transparent',
      color: colors.text.primary,
      hoverBackground: colors.neutral[100],
      activeBackground: colors.neutral[200],
      focusRing: colors.neutral[400],
    },
  },
  
  // Input variants
  input: {
    DEFAULT: {
      borderColor: colors.neutral[300],
      focusBorderColor: colors.primary[500],
      errorBorderColor: colors.error.DEFAULT,
      backgroundColor: colors.background.primary,
    },
  },
  
  // Card variants
  card: {
    DEFAULT: {
      background: colors.background.primary,
      border: `1px solid ${colors.neutral[200]}`,
      shadow: shadows.DEFAULT,
    },
    elevated: {
      background: colors.background.primary,
      border: 'none',
      shadow: shadows.lg,
    },
  },
};

// ===== UTILITY FUNCTIONS =====
export const utils = {
  // Media query helper
  media: {
    xs: `@media (min-width: ${breakpoints.xs})`,
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  },
  
  // Focus visible styles
  focusVisible: {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    boxShadow: `0 0 0 2px ${colors.primary[500]}`,
  },
  
  // Truncate text
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  
  // Aspect ratios
  aspectRatio: {
    square: '1 / 1',
    video: '16 / 9',
    '4/3': '4 / 3',
    '3/2': '3 / 2',
  },
};

// Export complete design system
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  transitions,
  variants,
  utils,
};

export default designSystem;