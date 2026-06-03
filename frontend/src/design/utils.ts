/**
 * Design System Utilities & Helpers
 * Utility functions for working with the design system
 */

import { colors, spacing, typography } from './tokens';

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Get a color from the palette
 */
export const getColor = (colorPath: string, opacity?: number): string => {
  const keys = colorPath.split('.');
  let value: any = colors;

  for (const key of keys) {
    value = value[key];
    if (!value) {
      console.warn(`Color not found: ${colorPath}`);
      return 'transparent';
    }
  }

  if (opacity !== undefined) {
    // Convert hex to rgba
    const hex = value.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return value;
};

// ============================================================================
// SPACING UTILITIES
// ============================================================================

/**
 * Get spacing value
 */
export const getSpacing = (key: keyof typeof spacing): string => {
  return spacing[key];
};

/**
 * Create responsive spacing
 */
export const createResponsiveSpacing = (
  base: keyof typeof spacing,
  sm?: keyof typeof spacing,
  md?: keyof typeof spacing,
  lg?: keyof typeof spacing
): string => {
  let result = `p-${base}`;
  if (sm) result += ` sm:p-${sm}`;
  if (md) result += ` md:p-${md}`;
  if (lg) result += ` lg:p-${lg}`;
  return result;
};

// ============================================================================
// TYPOGRAPHY UTILITIES
// ============================================================================

/**
 * Get typography style
 */
export const getTypography = (style: keyof typeof typography.styles) => {
  return typography.styles[style];
};

/**
 * Create typography CSS
 */
export const typographyToCss = (style: keyof typeof typography.styles): React.CSSProperties => {
  const typographyStyle = typography.styles[style];
  return {
    fontSize: typographyStyle.fontSize,
    fontWeight: typographyStyle.fontWeight,
    lineHeight: typographyStyle.lineHeight,
    letterSpacing: 'letterSpacing' in typographyStyle ? typographyStyle.letterSpacing : 'normal',
  };
};

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Merge class names conditionally
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Create conditional class names
 */
export const createClasses = (
  base: string,
  conditions: Record<string, boolean>
): string => {
  const conditionalClasses = Object.entries(conditions)
    .filter(([, value]) => value)
    .map(([className]) => className)
    .join(' ');

  return `${base} ${conditionalClasses}`.trim();
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Create responsive classes
 */
export const createResponsiveClasses = (base: string, responsive: Record<string, string>): string => {
  let result = base;
  for (const [breakpoint, className] of Object.entries(responsive)) {
    result += ` ${breakpoint}:${className}`;
  }
  return result;
};

/**
 * Get breakpoint value
 */
export const getBreakpoint = (breakpoint: string): string | undefined => {
  const breakpoints: Record<string, string> = {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };
  return breakpoints[breakpoint];
};

// ============================================================================
// SHADOW UTILITIES
// ============================================================================

/**
 * Create shadow combinations
 */
export const createShadow = (...shadows: string[]): string => {
  return shadows.join(', ');
};

// ============================================================================
// Z-INDEX UTILITIES
// ============================================================================

export const zIndexLayers = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================================================
// CONTRAST & ACCESSIBILITY
// ============================================================================

/**
 * Check if color has good contrast (WCAG AA standard)
 */
export const hasGoodContrast = (hex1: string, hex2: string): boolean => {
  const getLuminance = (hex: string): number => {
    const [r, g, b] = hex
      .replace('#', '')
      .match(/.{1,2}/g)!
      .map((x) => parseInt(x, 16) / 255);

    const adjustChannel = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const luminance =
      0.2126 * adjustChannel(r) +
      0.7152 * adjustChannel(g) +
      0.0722 * adjustChannel(b);

    return luminance;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const contrast = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return contrast >= 4.5; // AA standard
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Get theme colors
 */
export const getThemeColors = () => {
  return {
    primary: colors.brand[500],
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
  };
};

// ============================================================================
// SIZE UTILITIES
// ============================================================================

/**
 * Convert px to rem
 */
export const pxToRem = (px: number, baseFontSize: number = 16): number => {
  return px / baseFontSize;
};

/**
 * Convert rem to px
 */
export const remToPx = (rem: number, baseFontSize: number = 16): number => {
  return rem * baseFontSize;
};

// ============================================================================
// COLOR MANIPULATION
// ============================================================================

/**
 * Lighten a color by percentage
 */
export const lighten = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);

  return `#${(
    0x1000000 +
    R * 0x10000 +
    G * 0x100 +
    B
  )
    .toString(16)
    .substring(1)}`;
};

/**
 * Darken a color by percentage
 */
export const darken = (hex: string, percent: number): string => {
  return lighten(hex, -percent);
};

/**
 * Mix two colors
 */
export const mixColors = (hex1: string, hex2: string, percent: number = 0.5): string => {
  const num1 = parseInt(hex1.replace('#', ''), 16);
  const num2 = parseInt(hex2.replace('#', ''), 16);

  const r = Math.round(((num1 >> 16) & 255) * (1 - percent) + ((num2 >> 16) & 255) * percent);
  const g = Math.round(((num1 >> 8) & 255) * (1 - percent) + ((num2 >> 8) & 255) * percent);
  const b = Math.round((num1 & 255) * (1 - percent) + (num2 & 255) * percent);

  return `#${(
    0x1000000 +
    r * 0x10000 +
    g * 0x100 +
    b
  )
    .toString(16)
    .substring(1)}`;
};

/**
 * Get contrasting text color (black or white)
 */
export const getContrastingTextColor = (hex: string): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#FFFFFF';
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate hex color
 */
export const isValidHexColor = (hex: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

/**
 * Validate RGB color
 */
export const isValidRgbColor = (rgb: string): boolean => {
  return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(rgb);
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Create animation delay
 */
export const createAnimationDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay;
};

/**
 * Get duration in seconds
 */
export const getDurationInSeconds = (duration: number): number => {
  return duration / 1000;
};

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Generate color palette preview (for development)
 */
export const generateColorPaletteInfo = (): void => {
  console.log('%cDesign System Colors', 'background: #0e91eb; color: white; padding: 8px; font-weight: bold;');

  Object.entries(colors).forEach(([category, palette]) => {
    if (typeof palette === 'object') {
      console.group(category);
      Object.entries(palette).forEach(([key, value]) => {
        console.log(`%c ${key}`, `background: ${value}; color: ${getContrastingTextColor(value)}; padding: 4px;`, value);
      });
      console.groupEnd();
    }
  });
};

/**
 * Log design tokens
 */
export const logDesignTokens = (): void => {
  console.log('Design System Tokens:', {
    colors,
    spacing,
    typography,
  });
};
