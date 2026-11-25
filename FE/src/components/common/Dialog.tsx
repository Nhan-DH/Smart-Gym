import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  isOpen,
  onOpenChange,
  onClose,
  children,
}) => {
  const isActualOpen = open !== undefined ? open : !!isOpen;
  const handleOpenChange = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    if (!val && onClose) onClose();
  };

  // Check if children already contains DialogContent
  const hasContentChild = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DialogContent
  );

  return (
    <DialogPrimitive.Root open={isActualOpen} onOpenChange={handleOpenChange}>
      {hasContentChild ? (
        children
      ) : (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-in fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-surface p-6 shadow-xl duration-200 rounded-lg animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="absolute right-4 top-4">
              <DialogPrimitive.Close className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none p-1">
                <X className="h-4 w-4 text-text-secondary" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
};

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogHeader: React.FC<{
  title: string;
  description?: string;
  className?: string;
}> = ({ title, description, className }) => (
  <div className={cn('border-b border-border pb-3 pr-6', className)}>
    <DialogPrimitive.Title className="text-base font-bold text-text-primary">
      {title}
    </DialogPrimitive.Title>
    {description && (
      <DialogPrimitive.Description className="text-xs text-text-secondary mt-1">
        {description}
      </DialogPrimitive.Description>
    )}
  </div>
);

export const DialogBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('py-2', className)}>{children}</div>;

export const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('flex items-center justify-end gap-2.5 pt-3 border-t border-border mt-2', className)}>
    {children}
  </div>
);

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title?: string; description?: string }
>(({ className, children, title, description, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-in fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-surface p-6 shadow-xl duration-200 rounded-lg animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          {title && <DialogPrimitive.Title className="text-base font-bold text-text-primary">{title}</DialogPrimitive.Title>}
          {description && <DialogPrimitive.Description className="text-xs text-text-secondary mt-1">{description}</DialogPrimitive.Description>}
        </div>
        <DialogPrimitive.Close className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none p-1">
          <X className="h-4 w-4 text-text-secondary" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      <div>{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
