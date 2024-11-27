import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import PropTypes from 'prop-types';
import { cva, type VariantProps } from 'class-variance-authority';
import classNames from 'classnames';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-blue-700 text-blue-700 text-sm font-medium',
        secondary: 'bg-blue-700 text-white text-sm font-medium ',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-4 py-3',
        sm: 'px-3',
        lg: 'px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, id, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={classNames(buttonVariants({ variant, size, className }))} id={id} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  asChild: PropTypes.bool,
  id: PropTypes.string,
};

export { Button, buttonVariants };
