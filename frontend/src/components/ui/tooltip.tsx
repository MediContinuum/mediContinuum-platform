import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TOOLTIP PROVIDER                                                            */
/* -------------------------------------------------------------------------- */

const TooltipProvider = TooltipPrimitive.Provider;

/* -------------------------------------------------------------------------- */
/* TOOLTIP ROOT                                                                */
/* -------------------------------------------------------------------------- */

const Tooltip = TooltipPrimitive.Root;

/* -------------------------------------------------------------------------- */
/* TOOLTIP TRIGGER                                                             */
/* -------------------------------------------------------------------------- */

const TooltipTrigger = TooltipPrimitive.Trigger;

/* -------------------------------------------------------------------------- */
/* TOOLTIP CONTENT                                                             */
/* -------------------------------------------------------------------------- */

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, align = "center", ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "z-50 max-w-xs overflow-hidden rounded-md",
        "border border-border bg-popover px-3 py-1.5",
        "text-xs text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "origin-[var(--radix-tooltip-content-transform-origin)]",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
