import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* BUTTON VARIANTS                                                            */
/* -------------------------------------------------------------------------- */

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
    "outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,transform]",
    "duration-200 ease-out",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:translate-y-px",

        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/30",

        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",

        ghost: "hover:bg-accent hover:text-accent-foreground",

        link: "text-primary underline-offset-4 hover:underline",

        success:
          "bg-success text-success-foreground shadow-xs hover:bg-success/90",

        warning:
          "bg-warning text-warning-foreground shadow-xs hover:bg-warning/90",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* BUTTON PROPS                                                               */
/* -------------------------------------------------------------------------- */

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* BUTTON COMPONENT                                                           */
/* -------------------------------------------------------------------------- */

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      disabled = false,
      children,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    const content = loading ? (loadingText ?? children) : children;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading ? "true" : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={asChild ? undefined : isDisabled}
        type={asChild ? undefined : type}
        aria-disabled={asChild && isDisabled ? true : undefined}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}

        {content}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export default Button;
