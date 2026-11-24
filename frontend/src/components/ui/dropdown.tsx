import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* DROPDOWN ROOT                                                               */
/* -------------------------------------------------------------------------- */

const Dropdown = DropdownMenuPrimitive.Root;

const DropdownTrigger = DropdownMenuPrimitive.Trigger;

const DropdownPortal = DropdownMenuPrimitive.Portal;

const DropdownGroup = DropdownMenuPrimitive.Group;

const DropdownSub = DropdownMenuPrimitive.Sub;

const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* -------------------------------------------------------------------------- */
/* DROPDOWN SUB TRIGGER                                                        */
/* -------------------------------------------------------------------------- */

const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="dropdown-sub-trigger"
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm",
      "px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownSubTrigger.displayName = "DropdownSubTrigger";

/* -------------------------------------------------------------------------- */
/* DROPDOWN SUB CONTENT                                                        */
/* -------------------------------------------------------------------------- */

const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    data-slot="dropdown-sub-content"
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-md border border-border",
      "bg-popover p-1 text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      className,
    )}
    {...props}
  />
));

DropdownSubContent.displayName = "DropdownSubContent";

/* -------------------------------------------------------------------------- */
/* DROPDOWN CONTENT                                                            */
/* -------------------------------------------------------------------------- */

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      data-slot="dropdown-content"
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)]",
        "min-w-32 overflow-y-auto overflow-x-hidden rounded-md",
        "border border-border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownContent.displayName = "DropdownContent";

/* -------------------------------------------------------------------------- */
/* DROPDOWN ITEM                                                               */
/* -------------------------------------------------------------------------- */

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-slot="dropdown-item"
    data-variant={variant}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2",
      "rounded-sm px-2 py-1.5 text-sm outline-none",
      "transition-colors focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      variant === "destructive" &&
        "text-destructive focus:bg-destructive/10 focus:text-destructive",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));

DropdownItem.displayName = "DropdownItem";

/* -------------------------------------------------------------------------- */
/* DROPDOWN CHECKBOX ITEM                                                      */
/* -------------------------------------------------------------------------- */

const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="dropdown-checkbox-item"
    checked={checked}
    className={cn(
      "relative flex cursor-default select-none items-center",
      "rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "transition-colors focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

/* -------------------------------------------------------------------------- */
/* DROPDOWN RADIO ITEM                                                         */
/* -------------------------------------------------------------------------- */

const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    data-slot="dropdown-radio-item"
    className={cn(
      "relative flex cursor-default select-none items-center",
      "rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "transition-colors focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownRadioItem.displayName = "DropdownRadioItem";

/* -------------------------------------------------------------------------- */
/* DROPDOWN LABEL                                                              */
/* -------------------------------------------------------------------------- */

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot="dropdown-label"
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));

DropdownLabel.displayName = "DropdownLabel";

/* -------------------------------------------------------------------------- */
/* DROPDOWN SEPARATOR                                                          */
/* -------------------------------------------------------------------------- */

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-separator"
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

DropdownSeparator.displayName = "DropdownSeparator";

/* -------------------------------------------------------------------------- */
/* DROPDOWN SHORTCUT                                                           */
/* -------------------------------------------------------------------------- */

function DropdownShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="dropdown-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

DropdownShortcut.displayName = "DropdownShortcut";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export {
  Dropdown,
  DropdownTrigger,
  DropdownPortal,
  DropdownGroup,
  DropdownSub,
  DropdownRadioGroup,
  DropdownSubTrigger,
  DropdownSubContent,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
};
