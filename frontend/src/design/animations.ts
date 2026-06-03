/**
 * Animation Presets & Framer Motion Utilities
 * Standardized animation patterns for consistent motion
 */

import { Variants } from 'framer-motion';

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const pageSlideVariants: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
};

// ============================================================================
// STAGGER CONTAINER & CHILDREN
// ============================================================================

export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideInUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export const slideInDownVariants: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const slideInLeftVariants: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const slideInRightVariants: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export const popInVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.68, -0.55, 0.265, 1.55], // bouncy easing
    },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

export const flipInVariants: Variants = {
  initial: { opacity: 0, rotateY: -90 },
  animate: { opacity: 1, rotateY: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, rotateY: 90, transition: { duration: 0.3 } },
};

// ============================================================================
// INTERACTIVE ANIMATIONS
// ============================================================================

export const hoverLiftVariants: Variants = {
  whileHover: { y: -8, transition: { duration: 0.2 } },
  whileTap: { y: 0 },
};

export const hoverScaleVariants: Variants = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.95 },
};

export const hoverGlowVariants: Variants = {
  whileHover: {
    boxShadow: '0 0 30px rgba(14, 145, 235, 0.4)',
    transition: { duration: 0.2 },
  },
};

export const tapScaleVariants: Variants = {
  whileTap: { scale: 0.95 },
};

export const tapRotateVariants: Variants = {
  whileTap: { rotate: -2 },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

export const bounceVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// DRAG ANIMATIONS
// ============================================================================

export const draggableVariants: Variants = {
  whileDrag: { scale: 1.1, cursor: 'grabbing' },
  whileHover: { scale: 1.02, cursor: 'grab' },
};

// ============================================================================
// BLUR ANIMATIONS
// ============================================================================

export const blurInVariants: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.4 } },
  exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
};

// ============================================================================
// ACCORDION ANIMATIONS
// ============================================================================

export const accordionItemVariants: Variants = {
  closed: { opacity: 0, height: 0, overflow: 'hidden' },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

export const modalOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 50 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// SIDEBAR ANIMATIONS
// ============================================================================

export const sidebarVariants: Variants = {
  closed: { x: -250, opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const sidebarOverlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.2 } },
};

// ============================================================================
// DROPDOWN ANIMATIONS
// ============================================================================

export const dropdownVariants: Variants = {
  closed: {
    opacity: 0,
    y: -10,
    pointerEvents: 'none',
  },
  open: {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationVariants: Variants = {
  initial: { opacity: 0, x: 100, y: -20 },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 100, y: -20, transition: { duration: 0.2 } },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

// ============================================================================
// AVATAR ANIMATIONS
// ============================================================================

export const avatarHoverVariants: Variants = {
  whileHover: {
    scale: 1.1,
    boxShadow: '0 0 20px rgba(14, 145, 235, 0.3)',
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// TRANSITION CONFIGS
// ============================================================================

export const transitionConfig = {
  fast: { duration: 0.15, ease: 'easeOut' },
  base: { duration: 0.2, ease: 'easeOut' },
  moderate: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  smooth: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export const createStaggerVariants = (_itemCount: number) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
});

export const createDelayedVariants = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.3 },
  },
});

// ============================================================================
// PRESET ANIMATION CONFIGS
// ============================================================================

export const animationConfigs = {
  // Subtle animations
  subtle: {
    enter: { duration: 0.2, ease: 'easeOut' },
    exit: { duration: 0.15, ease: 'easeIn' },
  },

  // Medium animations
  medium: {
    enter: { duration: 0.3, ease: 'easeOut' },
    exit: { duration: 0.2, ease: 'easeIn' },
  },

  // Dramatic animations
  dramatic: {
    enter: { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] },
    exit: { duration: 0.3, ease: 'easeIn' },
  },
};
