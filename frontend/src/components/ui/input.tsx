import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* INPUT VARIANTS                                                             */
/* -------------------------------------------------------------------------- */

export const inputVariants = cva(
  [
    "flex w-full min-w-0 rounded-md border border-input bg-background",
    "text-sm text-foreground shadow-xs",
    "outline-none transition-[color,background-color,border-color,box-shadow]",
    "duration-200 ease-out",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent",
    "file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "read-only:cursor-default read-only:bg-muted/50",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        default: "h-9 px-3 py-1",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* INPUT PROPS                                                                */
/* -------------------------------------------------------------------------- */

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

/* -------------------------------------------------------------------------- */
/* INPUT COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size = "default",
      disabled = false,
      readOnly = false,
      required = false,
      autoComplete,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputVariants({ size }), className)}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
