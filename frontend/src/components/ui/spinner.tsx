

import * as React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* SPINNER PROPS                                                               */
/* -------------------------------------------------------------------------- */

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
}

/* -------------------------------------------------------------------------- */
/* SPINNER COMPONENT                                                           */
/* -------------------------------------------------------------------------- */

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = "md", label = "Loading", ...props }, ref) => {
    const sizeClasses = {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    };

    return (
      <LoaderCircle
        ref={ref}
        data-slot="spinner"
        role="status"
        aria-label={label}
        className={cn(
          "shrink-0 animate-spin text-current",
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
