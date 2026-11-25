import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary shadow-sm',
        volt: 'bg-volt text-darksidebar-bg hover:bg-volt-hover focus-visible:ring-volt font-bold shadow-sm',
        secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover shadow-sm',
        outline: 'border border-primary text-primary hover:bg-primary-light',
        outlineVolt: 'border border-volt text-volt hover:bg-volt/10',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
        danger: 'bg-status-danger text-white hover:bg-red-700 shadow-sm',
        kiosk: 'bg-volt text-darksidebar-bg hover:bg-volt-hover text-lg font-bold shadow-md tracking-wide',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-sm gap-1.5',
        md: 'h-10 px-4 text-sm rounded-md gap-2',
        lg: 'h-11 px-6 text-base rounded-md gap-2.5',
        xl: 'h-14 px-8 text-lg rounded-lg gap-3',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
