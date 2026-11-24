import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1",
    "overflow-hidden whitespace-nowrap rounded-md border",
    "px-2 py-0.5 text-xs font-medium",
    "transition-[color,background-color,border-color,box-shadow]",
    "duration-200 ease-out",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
    "[&>svg]:shrink-0",
    "focus-visible:border-ring focus-visible:ring-[3px]",
    "focus-visible:ring-ring/50",
    "aria-invalid:border-destructive",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",

        secondary: "border-transparent bg-secondary text-secondary-foreground",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground",

        outline: "border-border bg-transparent text-foreground",

        success: "border-transparent bg-success/10 text-success",

        warning: "border-transparent bg-warning/10 text-warning",

        info: "border-transparent bg-info/10 text-info",

        ghost: "border-transparent bg-muted text-muted-foreground",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export default Badge;
