import * as React from "react";

import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, animate = true, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "rounded-md bg-muted",
        animate && "animate-pulse",
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
