import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    const isIndeterminate = indeterminate && checked !== true;

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox"
        checked={isIndeterminate ? "indeterminate" : checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        className={cn(
          [
            "peer size-4 shrink-0 rounded-[4px]",
            "border border-input bg-background shadow-xs",
            "outline-none transition-[color,background-color,border-color,box-shadow]",
            "duration-200 ease-out",
            "data-[state=checked]:border-primary",
            "data-[state=checked]:bg-primary",
            "data-[state=checked]:text-primary-foreground",
            "data-[state=indeterminate]:border-primary",
            "data-[state=indeterminate]:bg-primary",
            "data-[state=indeterminate]:text-primary-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px]",
            "focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive",
            "aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
          ],
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current"
        >
          {isIndeterminate ? (
            <Minus className="size-3.5" strokeWidth={2.5} />
          ) : (
            <Check className="size-3.5" strokeWidth={2.5} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
