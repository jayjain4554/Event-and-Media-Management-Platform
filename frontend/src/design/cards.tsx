/**
 * Card System & Variants
 * Reusable card components with various styling options
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// ============================================================================
// BASE CARD
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'subtle' | 'minimal' | 'bordered';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  isLoading?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      variant = 'default',
      padding = 'md',
      interactive = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-dark-800 border border-dark-700 rounded-xl',
      glass: 'bg-glass-card border border-glass-border backdrop-blur-md rounded-xl',
      elevated: 'bg-dark-800 border border-dark-700 rounded-xl shadow-lg hover:shadow-xl',
      subtle: 'bg-dark-900/50 border border-dark-800/50 rounded-xl',
      minimal: 'bg-transparent border border-dark-700/50 rounded-lg',
      bordered: 'bg-transparent border-2 border-brand-500/30 rounded-xl',
    };

    const paddingClasses = {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        ref={ref}
        className={`${variantClasses[variant]} ${paddingClasses[padding]} transition-all duration-200 ${
          interactive ? 'cursor-pointer hover:border-brand-500/50 hover:shadow-glass-glow' : ''
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-brand-500"
            >
              ⟳
            </motion.div>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// CARD HEADER
// ============================================================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className = '',
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  ...props
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`} {...props}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="flex-shrink-0 mt-1">
            <Icon className="text-brand-400" size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-bold text-lg text-white truncate">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-dark-300 truncate">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// CARD BODY
// ============================================================================

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  spaced?: boolean;
}

export const CardBody: React.FC<CardBodyProps> = ({
  className = '',
  spaced = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`text-dark-200 text-sm leading-relaxed ${
        spaced ? 'space-y-3' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// CARD FOOTER
// ============================================================================

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  divider = false,
  children,
  ...props
}) => {
  return (
    <div
      className={`flex items-center gap-3 mt-6 pt-4 ${
        divider ? 'border-t border-dark-700' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// FEATURE CARD - Showcases a feature with icon and description
// ============================================================================

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'glass' | 'elevated';
  iconColor?: 'brand' | 'success' | 'danger' | 'warning' | 'info';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  variant = 'default',
  iconColor = 'brand',
}) => {
  const iconColorMap = {
    brand: 'text-brand-400',
    success: 'text-success-400',
    danger: 'text-danger-400',
    warning: 'text-warning-400',
    info: 'text-info-400',
  };

  return (
    <Card variant={variant} padding="lg">
      <div className="space-y-3">
        <div className={`w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center`}>
          <Icon className={`${iconColorMap[iconColor]}`} size={24} />
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">{title}</h4>
          <p className="text-sm text-dark-300 leading-relaxed mt-1">{description}</p>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// STAT CARD - Displays a statistic
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  variant?: 'default' | 'glass';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  variant = 'default',
}) => {
  const trendColorMap = {
    up: 'text-success-400',
    down: 'text-danger-400',
    neutral: 'text-dark-400',
  };

  return (
    <Card variant={variant} padding="md">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
            {label}
          </span>
          {Icon && <Icon className="text-brand-500" size={18} />}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {change !== undefined && (
            <span className={`text-xs font-semibold ${trendColorMap[trend]}`}>
              {trend === 'up' ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// MEDIA CARD - For displaying images/videos
// ============================================================================

interface MediaCardProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  src,
  alt,
  title,
  subtitle,
  badge,
  onClick,
  isLoading,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card variant="default" padding="xs" interactive className="overflow-hidden">
        <div className="relative pb-[100%] overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-brand-500"
              >
                ⟳
              </motion.div>
            </div>
          ) : (
            <>
              <img
                src={src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {badge && (
                <div className="absolute top-2 right-2 bg-brand-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  {badge}
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            </>
          )}
        </div>
        {(title || subtitle) && (
          <div className="p-3 space-y-1">
            {title && <p className="font-bold text-white text-sm truncate">{title}</p>}
            {subtitle && <p className="text-xs text-dark-300 truncate">{subtitle}</p>}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// ============================================================================
// INFO CARD - For displaying information with optional action
// ============================================================================

interface InfoCardProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'danger';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  message,
  action,
  type = 'info',
  dismissible = false,
  onDismiss,
}) => {
  const typeColorMap = {
    info: {
      bg: 'bg-info-500/10',
      border: 'border-info-500/30',
      icon: 'text-info-400',
    },
    success: {
      bg: 'bg-success-500/10',
      border: 'border-success-500/30',
      icon: 'text-success-400',
    },
    warning: {
      bg: 'bg-warning-500/10',
      border: 'border-warning-500/30',
      icon: 'text-warning-400',
    },
    danger: {
      bg: 'bg-danger-500/10',
      border: 'border-danger-500/30',
      icon: 'text-danger-400',
    },
  };

  const colors = typeColorMap[type];

  return (
    <Card
      variant="default"
      padding="md"
      className={`${colors.bg} border ${colors.border}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 mt-0.5">
            <Icon className={colors.icon} size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <p className="text-sm text-dark-200 mt-1">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-dark-400 hover:text-white transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </Card>
  );
};

// ============================================================================
// EMPTY STATE CARD - For showing empty states
// ============================================================================

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  return (
    <Card
      variant={variant}
      padding="lg"
      className="flex flex-col items-center justify-center min-h-64 text-center"
    >
      {Icon && (
        <div className="mb-4 p-4 rounded-full bg-dark-700">
          <Icon className="text-dark-400" size={32} />
        </div>
      )}
      <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-dark-300 max-w-sm mb-4">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
};

// ============================================================================
// TESTIMONIAL CARD
// ============================================================================

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  avatar,
  rating = 5,
}) => {
  return (
    <Card variant="glass" padding="lg">
      <div className="space-y-3">
        {rating > 0 && (
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < rating ? 'text-warning-400' : 'text-dark-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}
        <p className="text-dark-200 italic">"{quote}"</p>
        <div className="flex items-center gap-3 pt-2">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-white text-sm">{author}</p>
            {role && <p className="text-xs text-dark-400">{role}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// PRICING CARD
// ============================================================================

interface PricingCardProps {
  name: string;
  price: string | number;
  description?: string;
  features: string[];
  action?: React.ReactNode;
  highlighted?: boolean;
  icon?: LucideIcon;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  action,
  highlighted = false,
  icon: Icon,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        variant={highlighted ? 'glass' : 'default'}
        padding="lg"
        className={highlighted ? 'border-brand-500/50 shadow-glowBrand' : ''}
      >
        {highlighted && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-full text-xs font-semibold text-brand-300">
              Popular
            </span>
          </div>
        )}
        <div className="space-y-4">
          {Icon && (
            <Icon className="text-brand-400" size={28} />
          )}
          <div>
            <h4 className="font-bold text-lg text-white">{name}</h4>
            {description && (
              <p className="text-xs text-dark-300 mt-1">{description}</p>
            )}
          </div>
          <div>
            <span className="text-3xl font-bold text-white">${price}</span>
            <span className="text-dark-400 ml-1">/month</span>
          </div>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-dark-200">
                <span className="text-success-400">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </Card>
    </motion.div>
  );
};
