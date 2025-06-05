/**
 * Type definitions for Company of One Design System
 */

// Color types
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type SemanticColorLevel = 'light' | 'DEFAULT' | 'dark';

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

export interface SemanticColor {
  light: string;
  DEFAULT: string;
  dark: string;
}

// Typography types
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
export type FontWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export type LineHeight = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

// Spacing types
export type SpacingScale = 
  | 'px' | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;

// Border radius types
export type BorderRadiusScale = 'none' | 'sm' | 'DEFAULT' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

// Shadow types
export type ShadowScale = 'none' | 'sm' | 'DEFAULT' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'primary' | 'accent';

// Z-index types
export type ZIndexScale = 'auto' | 0 | 10 | 20 | 30 | 40 | 50 | 'dropdown' | 'sticky' | 'modal' | 'popover' | 'tooltip';

// Breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';

// Component variant interfaces
export interface ButtonVariantStyles {
  background: string;
  color: string;
  hoverBackground: string;
  activeBackground: string;
  focusRing: string;
}

export interface InputVariantStyles {
  borderColor: string;
  focusBorderColor: string;
  errorBorderColor: string;
  backgroundColor: string;
}

export interface CardVariantStyles {
  background: string;
  border: string;
  shadow: string;
}

// Main design system interface
export interface DesignSystem {
  colors: {
    primary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    success: SemanticColor;
    warning: SemanticColor;
    error: SemanticColor;
    info: SemanticColor;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      link: string;
      linkHover: string;
    };
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<FontSize, string>;
    fontWeight: Record<FontWeight, number>;
    lineHeight: Record<LineHeight, number>;
    letterSpacing: Record<LetterSpacing, string>;
  };
  spacing: Record<SpacingScale, string>;
  borderRadius: Record<BorderRadiusScale, string>;
  shadows: Record<ShadowScale, string>;
  zIndex: Record<ZIndexScale, number | string>;
  breakpoints: Record<Breakpoint, string>;
  transitions: {
    duration: Record<75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000, string>;
    easing: {
      linear: string;
      in: string;
      out: string;
      inOut: string;
      bounce: string;
    };
    common: {
      all: string;
      colors: string;
      opacity: string;
      shadow: string;
      transform: string;
    };
  };
  variants: {
    button: Record<ButtonVariant, ButtonVariantStyles>;
    input: {
      DEFAULT: InputVariantStyles;
    };
    card: {
      DEFAULT: CardVariantStyles;
      elevated: CardVariantStyles;
    };
  };
  utils: {
    media: Record<Breakpoint, string>;
    focusVisible: {
      outline: string;
      outlineOffset: string;
      boxShadow: string;
    };
    truncate: {
      overflow: string;
      textOverflow: string;
      whiteSpace: string;
    };
    aspectRatio: {
      square: string;
      video: string;
      '4/3': string;
      '3/2': string;
    };
  };
}