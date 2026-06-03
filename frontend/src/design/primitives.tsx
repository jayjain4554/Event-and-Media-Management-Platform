/**
 * UI Component Library - Primitives
 * Reusable button, input, badge, and other base components
 * Dark mode first, premium aesthetic
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

// Install class-variance-authority: npm install class-variance-authority clsx

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
  {
    variants: {
      variant: {
        // Solid variants
        primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-soft hover:shadow-glowBrand',
        secondary: 'bg-dark-800 text-white hover:bg-dark-700 border border-dark-700 hover:border-brand-500/30',
        success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-soft hover:shadow-glowSuccess',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-soft hover:shadow-glowDanger',
        warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-soft',

        // Ghost variants
        ghost: 'text-dark-300 hover:text-white hover:bg-dark-800/50 border border-transparent hover:border-dark-700/50',
        ghostBrand: 'text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 border border-transparent hover:border-brand-500/20',

        // Glass variants
        glass: 'bg-glass-card text-white border border-glass-border hover:bg-glass-lighter hover:border-brand-500/30 backdrop-blur-md',
        glassInverted: 'bg-white/5 text-dark-100 border border-white/10 hover:bg-white/10 hover:border-white/20',
      },

      size: {
        xs: 'px-2 py-1 text-xs rounded-md gap-1',
        sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
        md: 'px-4 py-2 text-sm rounded-lg gap-2',
        lg: 'px-6 py-3 text-base rounded-xl gap-2',
        xl: 'px-8 py-4 text-base rounded-xl gap-3',
        full: 'w-full px-4 py-2 text-base rounded-lg gap-2',
      },

      shape: {
        default: '',
        pill: 'rounded-full',
        icon: 'rounded-md',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant,
      size,
      shape,
      isLoading,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${buttonVariants({ variant, size, shape })} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {LeftIcon && (typeof LeftIcon === 'function' ? <LeftIcon size={16} /> : LeftIcon)}
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
            ⟳
          </motion.div>
        ) : (
          children
        )}
        {RightIcon && (typeof RightIcon === 'function' ? <RightIcon size={16} /> : RightIcon)}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// INPUT COMPONENT
// ============================================================================

const inputVariants = cva(
  'w-full font-sans transition-all duration-200 placeholder:text-dark-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-dark-800 border border-dark-700 text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30',
        glass: 'bg-glass-card border border-glass-border text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 backdrop-blur-sm',
        minimal: 'bg-transparent border-b-2 border-dark-700 text-dark-100 focus:border-brand-500 px-0',
      },

      size: {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2 text-base rounded-lg',
        lg: 'px-5 py-3 text-lg rounded-xl',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      variant,
      size,
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
            {props.required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 text-dark-400 pointer-events-none" size={18} />
          )}
          <input
            ref={ref}
            className={`${inputVariants({ variant, size })} ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {RightIcon && (
            <RightIcon className="absolute right-3 text-dark-400 pointer-events-none" size={18} />
          )}
        </div>
        {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-dark-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// SELECT COMPONENT
// ============================================================================

const selectVariants = cva(
  'w-full font-sans transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none',
  {
    variants: {
      variant: {
        default: 'bg-dark-800 border border-dark-700 text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30',
        glass: 'bg-glass-card border border-glass-border text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30',
      },

      size: {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2 text-base rounded-lg',
        lg: 'px-5 py-3 text-lg rounded-xl',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className = '', variant, size, label, error, options, ...props },
    ref
  ) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
            {props.required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`${selectVariants({ variant, size })} ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 text-dark-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================================================
// BADGE COMPONENT
// ============================================================================

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
        secondary: 'bg-dark-700/50 text-dark-200 border border-dark-600/50',
        success: 'bg-success-500/20 text-success-300 border border-success-500/30',
        danger: 'bg-danger-500/20 text-danger-300 border border-danger-500/30',
        warning: 'bg-warning-500/20 text-warning-300 border border-warning-500/30',
        info: 'bg-info-500/20 text-info-300 border border-info-500/30',
      },

      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md gap-1',
        md: 'px-2.5 py-1 text-sm rounded-lg gap-1.5',
        lg: 'px-3 py-1.5 text-base rounded-lg gap-2',
      },
    },

    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: LucideIcon | React.ReactNode;
  onDismiss?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant,
  size,
  icon: Icon,
  onDismiss,
  children,
  ...props
}) => {
  return (
    <div className={`${badgeVariants({ variant, size })} ${className}`} {...props}>
      {Icon &&
        (typeof Icon === 'function' ? <Icon size={14} /> : Icon)}
      <span>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
};

Badge.displayName = 'Badge';

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className = '', label, description, error, ...props },
    ref
  ) => {
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border border-dark-600 bg-dark-800 accent-brand-500 cursor-pointer focus:ring-2 focus:ring-brand-500/30 transition-all"
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label className="block text-sm font-medium text-dark-200 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-dark-400 mt-0.5">{description}</p>
          )}
          {error && (
            <p className="text-xs text-danger-400 mt-1">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'glass' | 'minimal';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-dark-800 border border-dark-700 text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30',
      glass: 'bg-glass-card border border-glass-border text-dark-100 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 backdrop-blur-sm',
      minimal: 'bg-transparent border-b-2 border-dark-700 text-dark-100 focus:border-brand-500 px-0',
    };

    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
            {props.required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full font-sans ${variantClasses[variant]} px-4 py-3 rounded-lg transition-all duration-200 placeholder:text-dark-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-vertical ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-dark-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================================================
// RADIO COMPONENT
// ============================================================================

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { className = '', label, ...props },
    ref
  ) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          className="w-4 h-4 border border-dark-600 bg-dark-800 accent-brand-500 cursor-pointer focus:ring-2 focus:ring-brand-500/30 transition-all"
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-dark-200 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// ============================================================================
// SWITCH COMPONENT
// ============================================================================

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    { className = '', label, description, ...props },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(props.checked || false);

    return (
      <div className="flex items-start gap-3">
        <div className="relative inline-flex">
          <input
            ref={ref}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="hidden"
            {...props}
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors duration-200 ${
              isChecked ? 'bg-brand-500' : 'bg-dark-700'
            } cursor-pointer`}
          />
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{ x: isChecked ? 20 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        {label && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-200 cursor-pointer">
              {label}
            </label>
            {description && (
              <p className="text-xs text-dark-400 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
