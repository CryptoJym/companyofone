# Company of One Design System Documentation

## Overview
The Company of One Design System provides a comprehensive set of design tokens and utilities for building a consistent, professional interface targeted at solopreneurs and small business owners.

## Core Principles
- **Professional**: Clean, trustworthy design that conveys expertise
- **Accessible**: High contrast ratios and clear typography
- **Responsive**: Mobile-first approach with thoughtful breakpoints
- **Consistent**: Unified visual language across all components

## Colors

### Brand Colors
- **Primary (Utlyze Blue)**: `#4169E1` - Used for primary actions, links, and brand elements
- **Accent (Energetic Red)**: `#E74C3C` - Used for CTAs and important highlights

### Usage Examples
```typescript
import { colors } from '@/styles/design-system';

// Primary button
const buttonStyle = {
  backgroundColor: colors.primary[500],
  color: colors.text.inverse,
  '&:hover': {
    backgroundColor: colors.primary[600],
  }
};

// Error message
const errorStyle = {
  color: colors.error.DEFAULT,
  backgroundColor: colors.error.light + '10', // 10% opacity
};
```

### Tailwind Classes
```html
<!-- Primary button -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Get Started
</button>

<!-- Accent CTA -->
<button class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent">
  Book Consultation
</button>
```

## Typography

### Font Stack
- **Sans**: Inter (primary), system fonts fallback
- **Serif**: Georgia, Times New Roman
- **Mono**: JetBrains Mono, Consolas

### Type Scale
- `xs`: 0.75rem (12px) - Small labels, captions
- `sm`: 0.875rem (14px) - Body text, form labels
- `base`: 1rem (16px) - Default body text
- `lg`: 1.125rem (18px) - Emphasized body text
- `xl`: 1.25rem (20px) - Small headings
- `2xl`: 1.5rem (24px) - Section headings
- `3xl`: 1.875rem (30px) - Page headings
- `4xl`: 2.25rem (36px) - Hero headings
- `5xl`: 3rem (48px) - Large hero text
- `6xl`: 3.75rem (60px) - Extra large displays
- `7xl`: 4.5rem (72px) - Maximum display size

### Usage Examples
```typescript
import { typography } from '@/styles/design-system';

// Heading styles
const h1Style = {
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold,
  lineHeight: typography.lineHeight.tight,
};

// Body text
const bodyStyle = {
  fontSize: typography.fontSize.base,
  lineHeight: typography.lineHeight.relaxed,
  color: colors.text.secondary,
};
```

## Spacing

Our spacing system follows an 8px base unit for consistency:
- `spacing.1`: 0.25rem (4px)
- `spacing.2`: 0.5rem (8px)
- `spacing.4`: 1rem (16px)
- `spacing.8`: 2rem (32px)
- `spacing.16`: 4rem (64px)

### Common Patterns
```css
/* Card padding */
.card {
  padding: spacing.6; /* 24px */
}

/* Section spacing */
.section {
  padding-top: spacing.16; /* 64px */
  padding-bottom: spacing.16;
}

/* Form element spacing */
.form-group {
  margin-bottom: spacing.4; /* 16px */
}
```

## Components

### Buttons
```typescript
// Primary button
<button className="
  bg-primary-500 hover:bg-primary-600 active:bg-primary-700
  text-white font-semibold
  px-6 py-3 rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
">
  Get Started
</button>

// Accent CTA button
<button className="
  bg-accent-500 hover:bg-accent-600 active:bg-accent-700
  text-white font-semibold
  px-8 py-4 rounded-xl
  shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
  transition-all duration-200
">
  Book Your Free Consultation
</button>
```

### Cards
```typescript
// Default card
<div className="
  bg-white
  border border-neutral-200
  rounded-xl
  p-6
  shadow-sm hover:shadow-md
  transition-shadow duration-200
">
  {/* Card content */}
</div>

// Elevated card
<div className="
  bg-white
  rounded-2xl
  p-8
  shadow-lg hover:shadow-xl
  transform hover:-translate-y-1
  transition-all duration-300
">
  {/* Card content */}
</div>
```

### Forms
```typescript
// Input field
<input className="
  w-full
  px-4 py-3
  border border-neutral-300
  rounded-lg
  focus:border-primary-500 focus:ring-2 focus:ring-primary-200
  transition-all duration-200
  placeholder:text-neutral-400
" />

// Error state
<input className="
  w-full
  px-4 py-3
  border-2 border-error-DEFAULT
  rounded-lg
  focus:ring-2 focus:ring-error-light
  bg-error-light bg-opacity-10
" />
```

## Responsive Design

### Breakpoints
- `xs`: 475px - Extra small devices
- `sm`: 640px - Small devices (landscape phones)
- `md`: 768px - Medium devices (tablets)
- `lg`: 1024px - Large devices (desktops)
- `xl`: 1280px - Extra large devices
- `2xl`: 1536px - Extra extra large devices

### Usage
```typescript
// Using media queries
const responsiveStyles = {
  padding: spacing[4], // 16px mobile
  [utils.media.md]: {
    padding: spacing[8], // 32px tablet+
  },
  [utils.media.lg]: {
    padding: spacing[16], // 64px desktop+
  },
};

// Tailwind responsive classes
<div className="p-4 md:p-8 lg:p-16">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">
    Responsive Heading
  </h1>
</div>
```

## Animations

### Available Animations
- `fadeIn` / `fadeOut` - Opacity transitions
- `slideIn` / `slideOut` - Vertical slide transitions
- `scaleIn` / `scaleOut` - Scale with opacity
- `bounce` - Attention-grabbing bounce
- `spin` - Loading spinner
- `pulse` - Subtle pulsing effect

### Usage
```html
<!-- Fade in on mount -->
<div className="animate-fadeIn">
  Welcome content
</div>

<!-- Bounce CTA button -->
<button className="animate-bounce hover:animate-none">
  Click Me!
</button>

<!-- Loading spinner -->
<div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
```

## Accessibility Guidelines

1. **Color Contrast**: All text colors meet WCAG AA standards against their backgrounds
2. **Focus States**: All interactive elements have visible focus indicators
3. **Typography**: Minimum font size of 14px for body text
4. **Spacing**: Touch targets are at least 44x44px
5. **Animations**: Respect `prefers-reduced-motion` preference

## Implementation with Tailwind

In your `tailwind.config.js`:

```javascript
import { companyOfOneTailwindTheme } from '@/styles/tailwind-helpers';

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: companyOfOneTailwindTheme,
  plugins: [],
};
```

## CSS Custom Properties

For non-Tailwind usage, import the CSS variables:

```css
@import '@/styles/design-system.css';

.custom-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}
```

## Best Practices

1. **Consistency**: Always use design tokens instead of arbitrary values
2. **Hierarchy**: Use the type scale to create clear visual hierarchy
3. **Whitespace**: Use generous spacing for a clean, professional look
4. **Feedback**: Provide hover, active, and focus states for all interactive elements
5. **Performance**: Use CSS transitions sparingly and prefer `transform` and `opacity`

## Support

For questions or suggestions about the design system, please contact the design team or create an issue in the repository.