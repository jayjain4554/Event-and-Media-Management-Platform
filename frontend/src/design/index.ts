/**
 * Design System Index
 * Central export point for all design system components and utilities
 */

// ============================================================================
// TOKENS
// ============================================================================

export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  motionPresets,
  zIndex,
  breakpoints,
  containerSizes,
  componentSizes,
  opacity,
} from './tokens';

// ============================================================================
// UI PRIMITIVES
// ============================================================================

export { Button } from './primitives';
export { Input } from './primitives';
export { Select } from './primitives';
export { Badge } from './primitives';
export { Checkbox } from './primitives';
export { Textarea } from './primitives';
export { Radio } from './primitives';
export { Switch } from './primitives';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export {
  Container,
  Section,
  Flex,
  Grid,
  Stack,
  Group,
  Spacer,
  Center,
  AspectRatio,
  Divider,
  AnimatedContainer,
} from './layout';

// ============================================================================
// CARD SYSTEM
// ============================================================================

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FeatureCard,
  StatCard,
  MediaCard,
  InfoCard,
  EmptyState,
  TestimonialCard,
  PricingCard,
} from './cards';

// ============================================================================
// ANIMATIONS
// ============================================================================

export {
  // Page transitions
  pageTransitionVariants,
  pageSlideVariants,

  // Stagger
  staggerContainerVariants,
  staggerItemVariants,

  // Entrance animations
  fadeInVariants,
  slideInUpVariants,
  slideInDownVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  popInVariants,
  flipInVariants,

  // Interactive animations
  hoverLiftVariants,
  hoverScaleVariants,
  hoverGlowVariants,
  tapScaleVariants,
  tapRotateVariants,

  // Loading animations
  spinVariants,
  pulseVariants,
  shimmerVariants,
  bounceVariants,

  // Drag animations
  draggableVariants,

  // Blur animations
  blurInVariants,

  // Accordion animations
  accordionItemVariants,

  // Modal animations
  modalOverlayVariants,
  modalContentVariants,

  // Sidebar animations
  sidebarVariants,
  sidebarOverlayVariants,

  // Dropdown animations
  dropdownVariants,

  // Notification animations
  notificationVariants,
  toastVariants,

  // Avatar animations
  avatarHoverVariants,

  // Utilities
  transitionConfig,
  createStaggerVariants,
  createDelayedVariants,
  animationConfigs,
} from './animations';

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

export {
  // Color utilities
  getColor,

  // Spacing utilities
  getSpacing,
  createResponsiveSpacing,

  // Typography utilities
  getTypography,
  typographyToCss,

  // Class name utilities
  cn,
  createClasses,

  // Responsive utilities
  createResponsiveClasses,
  getBreakpoint,

  // Shadow utilities
  createShadow,

  // Z-index utilities
  zIndexLayers,

  // Contrast & accessibility
  hasGoodContrast,

  // Theme utilities
  getThemeColors,

  // Size utilities
  pxToRem,
  remToPx,

  // Color manipulation
  lighten,
  darken,
  mixColors,
  getContrastingTextColor,

  // Validation utilities
  isValidHexColor,
  isValidRgbColor,

  // Animation utilities
  createAnimationDelay,
  getDurationInSeconds,

  // Debug utilities
  generateColorPaletteInfo,
  logDesignTokens,
} from './utils';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  VariantProps,
} from 'class-variance-authority';

export type { Variants as FramerMotionVariants } from 'framer-motion';
