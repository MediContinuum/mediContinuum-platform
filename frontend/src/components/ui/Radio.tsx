import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    data-slot="radio-group"
    orientation={orientation}
    className={cn(
      "grid gap-3",
      orientation === "horizontal" && "grid-flow-col auto-cols-max",
      className,
    )}
    {...props}
  />
));

RadioGroup.displayName = "RadioGroup";

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, disabled = false, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio"
    disabled={disabled}
    className={cn(
      [
        "aspect-square size-4 shrink-0 rounded-full",
        "border border-primary bg-background shadow-xs",
        "text-primary outline-none",
        "transition-[color,background-color,border-color,box-shadow]",
        "duration-200 ease-out",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        "aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
      ],
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      data-slot="radio-indicator"
      className="flex items-center justify-center"
    >
      <Circle className="size-2.5 fill-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

Radio.displayName = "Radio";

export { RadioGroup, Radio };
export default Radio;
