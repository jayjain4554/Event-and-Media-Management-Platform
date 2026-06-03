/**
 * Design System Tokens
 * Centralized values for colors, typography, spacing, shadows, and animations
 * Dark mode first, premium aesthetic inspired by Linear, Notion, Stripe
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Brand
  brand: {
    50: '#f0f7ff',
    100: '#e0effe',
    200: '#bae0fd',
    300: '#7cc8fc',
    400: '#38abfa',
    500: '#0e91eb', // Primary
    600: '#0273c8',
    700: '#035ca2',
    800: '#074e85',
    900: '#0c426e',
    950: '#082a4a',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Primary green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Primary red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Primary amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Primary cyan
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },

  // Neutral/Grayscale
  neutral: {
    50: '#f6f6f7',
    100: '#ececf1',
    200: '#e3e3e8',
    300: '#d9d9e3',
    400: '#bec3cb',
    500: '#a0a9b8',
    600: '#808992',
    700: '#5c666f',
    800: '#3f4655',
    900: '#2d2e33',
  },

  // Dark Mode Palette
  dark: {
    50: '#f6f6f7',
    100: '#eef0f2',
    200: '#dadfe3',
    300: '#b8c2cc',
    400: '#8f9da9',
    500: '#677584',
    600: '#4c5663',
    700: '#313841',
    800: '#1a1f26',
    900: '#111318',
    950: '#0b0c0f',
  },

  // Glass/Overlay Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    lighter: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.08)',
    card: 'rgba(20, 22, 28, 0.7)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
};

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, Outfit, system-ui, -apple-system, sans-serif',
    mono: 'Menlo, Monaco, Consolas, monospace',
  },

  // Font sizes (px to rem conversion: 16px = 1rem)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Predefined text styles (components will use these)
  styles: {
    h1: {
      fontSize: '3.75rem', // 60px
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '3rem', // 48px
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h5: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h6: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.25,
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    label: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.25,
    },
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.25,
    },
  },
};

// ============================================================================
// SPACING SYSTEM (8px base grid)
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  base: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px',
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Glass shadows
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  glassSmall: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
  glassLarge: '0 20px 60px 0 rgba(0, 0, 0, 0.5)',

  // Glow effects
  glowBrand: '0 0 20px 0 rgba(14, 145, 235, 0.2)',
  glowSuccess: '0 0 20px 0 rgba(34, 197, 94, 0.2)',
  glowDanger: '0 0 20px 0 rgba(239, 68, 68, 0.2)',

  // Soft shadows (premium aesthetic)
  soft: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  softLarge: '0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12)',
};

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const transitions = {
  // Duration
  duration: {
    fast: 150,
    base: 200,
    moderate: 300,
    slow: 500,
    slower: 700,
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Predefined transitions
  standard: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fadeIn: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slideIn: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================================================
// FRAMER MOTION ANIMATION PRESETS
// ============================================================================

export const motionPresets = {
  // Entrance animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  popIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },

  // Hover effects
  hoverLift: {
    whileHover: { y: -4 },
    transition: { duration: 0.2 },
  },

  hoverScale: {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 },
  },

  // Tap effects
  tapScale: {
    whileTap: { scale: 0.98 },
  },

  tapRotate: {
    whileTap: { rotate: -1 },
  },
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 0,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// CONTAINER SIZES
// ============================================================================

export const containerSizes = {
  xs: '20rem', // 320px
  sm: '24rem', // 384px
  md: '28rem', // 448px
  lg: '32rem', // 512px
  xl: '36rem', // 576px
  '2xl': '42rem', // 672px
  '3xl': '48rem', // 768px
  '4xl': '56rem', // 896px
  '5xl': '64rem', // 1024px
  '6xl': '72rem', // 1152px
  '7xl': '80rem', // 1280px
  full: '100%',
};

// ============================================================================
// COMPONENT SIZING
// ============================================================================

export const componentSizes = {
  // Button sizes
  button: {
    xs: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      height: '1.75rem',
    },
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      height: '2rem',
    },
    md: {
      padding: '0.625rem 1.25rem',
      fontSize: '0.875rem',
      height: '2.5rem',
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      height: '3rem',
    },
    xl: {
      padding: '1rem 2rem',
      fontSize: '1rem',
      height: '3.5rem',
    },
  },

  // Input sizes
  input: {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      height: '2rem',
    },
    md: {
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      height: '2.5rem',
    },
    lg: {
      padding: '1rem 1.25rem',
      fontSize: '1rem',
      height: '3rem',
    },
  },

  // Icon sizes
  icon: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px',
  },
};

// ============================================================================
// OPACITY VALUES
// ============================================================================

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
};
