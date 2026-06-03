/**
 * Layout Components & Primitives
 * Reusable layout building blocks for consistent spacing and structure
 */

import React from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from './tokens';

// ============================================================================
// CONTAINER - Responsive max-width wrapper
// ============================================================================

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  className = '',
  size = 'xl',
  padding = true,
  centered = true,
  children,
  ...props
}) => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'w-full',
  };

  return (
    <div
      className={`${sizes[size]} ${padding ? 'px-4 sm:px-6 lg:px-8' : ''} ${
        centered ? 'mx-auto' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SECTION - Vertical spacing container with optional background
// ============================================================================

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'subtle';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({
  className = '',
  variant = 'default',
  padding = 'lg',
  gap = 'lg',
  children,
  ...props
}) => {
  const paddingMap = {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12',
  };

  const gapMap = {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-10',
  };

  const variantMap = {
    default: 'bg-transparent',
    glass: 'bg-glass-card border border-glass-border backdrop-blur-md rounded-2xl',
    elevated: 'bg-dark-800 border border-dark-700 rounded-2xl shadow-lg',
    subtle: 'bg-dark-900/50 rounded-2xl',
  };

  return (
    <section
      className={`${variantMap[variant]} ${paddingMap[padding]} ${gapMap[gap]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

// ============================================================================
// FLEX - Flexible layout component
// ============================================================================

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  wrap?: boolean;
  fullWidth?: boolean;
}

export const Flex: React.FC<FlexProps> = ({
  className = '',
  direction = 'row',
  align = 'center',
  justify = 'start',
  gap = 'md',
  wrap = false,
  fullWidth = false,
  children,
  ...props
}) => {
  const directionMap = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapMap = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  return (
    <div
      className={`flex ${directionMap[direction]} ${alignMap[align]} ${justifyMap[justify]} ${gapMap[gap]} ${
        wrap ? 'flex-wrap' : ''
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// GRID - CSS Grid layout component
// ============================================================================

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12 | 'auto';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  autoRows?: 'auto' | 'max-content' | 'min-content';
  responsive?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  className = '',
  columns = 3,
  gap = 'md',
  autoRows = 'auto',
  responsive = true,
  children,
  ...props
}) => {
  const columnsMap = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
    12: 'grid-cols-12',
    auto: 'auto-cols-fr',
  };

  const gapMap = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  const autoRowsMap = {
    auto: 'auto-rows-auto',
    'max-content': 'auto-rows-max',
    'min-content': 'auto-rows-min',
  };

  return (
    <div
      className={`grid ${columnsMap[columns]} ${gapMap[gap]} ${autoRowsMap[autoRows]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// STACK - Vertical spacing component
// ============================================================================

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  fullWidth?: boolean;
}

export const Stack: React.FC<StackProps> = ({
  className = '',
  gap = 'md',
  align = 'stretch',
  fullWidth = true,
  children,
  ...props
}) => {
  const gapMap = {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={`flex flex-col ${gapMap[gap]} ${alignMap[align]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// GROUP - Horizontal spacing component
// ============================================================================

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}

export const Group: React.FC<GroupProps> = ({
  className = '',
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = true,
  children,
  ...props
}) => {
  const gapMap = {
    xs: 'space-x-2',
    sm: 'space-x-3',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${wrap ? 'flex-wrap' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// SPACER - Vertical or horizontal spacing
// ============================================================================

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  horizontal?: boolean;
  vertical?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  horizontal = false,
  vertical = true,
}) => {
  const sizeMap = {
    xs: 'h-2 w-2',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  };

  if (horizontal) {
    return <div className={`${sizeMap[size]} w-auto`} />;
  }

  if (vertical) {
    return <div className={`${sizeMap[size]} h-auto`} />;
  }

  return <div className={sizeMap[size]} />;
};

// ============================================================================
// CENTER - Centered content container
// ============================================================================

interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  fullHeight?: boolean;
}

export const Center: React.FC<CenterProps> = ({
  className = '',
  fullHeight = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? 'min-h-screen' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// ASPECT RATIO - Maintains aspect ratio for images/videos
// ============================================================================

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: 'square' | '4/3' | '16/9' | '21/9' | '1/1' | '3/2' | '9/16' | number;
}

export const AspectRatio: React.FC<AspectRatioProps> = ({
  className = '',
  ratio = '16/9',
  children,
  ...props
}) => {
  const ratioMap: Record<string, string> = {
    square: 'aspect-square',
    '1/1': 'aspect-square',
    '4/3': 'aspect-video',
    '16/9': 'aspect-video',
    '21/9': 'aspect-auto',
    '3/2': 'aspect-video',
    '9/16': 'aspect-auto',
  };

  const ratioClass = typeof ratio === 'number'
    ? `aspect-auto`
    : ratioMap[ratio] || 'aspect-video';

  return (
    <div
      className={`relative w-full overflow-hidden ${ratioClass} ${className}`}
      style={{
        paddingBottom: typeof ratio === 'number' ? `${(1 / ratio) * 100}%` : undefined,
      }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};

// ============================================================================
// DIVIDER - Visual separator
// ============================================================================

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withLabel?: string;
}

export const Divider: React.FC<DividerProps> = ({
  className = '',
  variant = 'solid',
  orientation = 'horizontal',
  size = 'sm',
  withLabel,
  ...props
}) => {
  const variantMap = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const sizeMap = {
    xs: 'border-t',
    sm: 'border-t',
    md: 'border-2',
    lg: 'border-4',
  };

  const sizeClass = sizeMap[size];

  if (orientation === 'vertical') {
    return (
      <div
        className={`h-full border-l ${sizeClass} border-dark-700 ${variantMap[variant]} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`} {...props}>
      <div className={`flex-1 border-t border-dark-700 ${variantMap[variant]}`} />
      {withLabel && (
        <span className="text-xs font-medium text-dark-400 px-2">{withLabel}</span>
      )}
      <div className={`flex-1 border-t border-dark-700 ${variantMap[variant]}`} />
    </div>
  );
};

// ============================================================================
// ANIMATED CONTAINER - Motion wrapper for entrance animations
// ============================================================================

interface AnimatedContainerProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  animation?: keyof typeof motionPresets;
  delay?: number;
}

export const AnimatedContainer = React.forwardRef<HTMLDivElement, AnimatedContainerProps>(
  (
    { className = '', animation = 'fadeIn', delay = 0, children, ...props },
    ref
  ) => {
    const animationPreset = motionPresets[animation] as {
      initial?: any;
      animate?: any;
      exit?: any;
    };

    return (
      <motion.div
        ref={ref}
        initial={animationPreset.initial}
        animate={animationPreset.animate}
        exit={animationPreset.exit}
        transition={{ duration: 0.3, delay }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';
