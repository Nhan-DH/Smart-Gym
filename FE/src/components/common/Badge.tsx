import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-sm text-xs select-none border',
  {
    variants: {
      variant: {
        success: 'bg-status-success-bg text-status-success border-emerald-200',
        warning: 'bg-status-warning-bg text-status-warning border-amber-200',
        danger: 'bg-status-danger-bg text-status-danger border-rose-200',
        info: 'bg-status-info-bg text-status-info border-blue-200',
        neutral: 'bg-surface-subtle text-text-secondary border-border',
        primary: 'bg-primary-light text-primary border-primary-border',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};
