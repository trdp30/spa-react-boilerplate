import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import classNames from 'classnames';

 
const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    isWarning: boolean | null | undefined;
    value: number;
  }
>(({ value, isWarning, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={classNames('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary')}
    {...props}
  >
    {value && (
      <ProgressPrimitive.Indicator
        className={classNames('h-full w-full flex-1 transition-all bg-blue-700', isWarning && 'bg-red-700')}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    )}
  </ProgressPrimitive.Root>
));
ProgressBar.displayName = ProgressPrimitive.Root.displayName;

export { ProgressBar };
