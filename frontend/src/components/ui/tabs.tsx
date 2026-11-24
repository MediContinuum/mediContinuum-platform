import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* TABS ROOT                                                                   */
/* -------------------------------------------------------------------------- */

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));

Tabs.displayName = "Tabs";

/* -------------------------------------------------------------------------- */
/* TABS LIST                                                                   */
/* -------------------------------------------------------------------------- */

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(
      "inline-flex h-9 w-fit items-center justify-center",
      "rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));

TabsList.displayName = "TabsList";

/* -------------------------------------------------------------------------- */
/* TABS TRIGGER                                                                */
/* -------------------------------------------------------------------------- */

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      "inline-flex h-[calc(100%-1px)] flex-1 items-center",
      "justify-center gap-1.5 whitespace-nowrap rounded-md",
      "border border-transparent px-2 py-1 text-sm font-medium",
      "text-muted-foreground outline-none",
      "transition-[color,background-color,box-shadow]",
      "focus-visible:border-ring focus-visible:ring-[3px]",
      "focus-visible:ring-ring/50",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background",
      "data-[state=active]:text-foreground",
      "data-[state=active]:shadow-sm",
      "[&_svg]:pointer-events-none [&_svg]:size-4",
      "[&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));

TabsTrigger.displayName = "TabsTrigger";

/* -------------------------------------------------------------------------- */
/* TABS CONTENT                                                                */
/* -------------------------------------------------------------------------- */

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(
      "flex-1 outline-none",
      "focus-visible:ring-[3px] focus-visible:ring-ring/50",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export { Tabs, TabsList, TabsTrigger, TabsContent };
