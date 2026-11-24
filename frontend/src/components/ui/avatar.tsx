import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* AVATAR ROOT                                                                 */
/* -------------------------------------------------------------------------- */

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(
      "relative flex size-10 shrink-0 overflow-hidden rounded-full",
      "bg-muted",
      className,
    )}
    {...props}
  />
));

Avatar.displayName = "Avatar";

/* -------------------------------------------------------------------------- */
/* AVATAR IMAGE                                                                */
/* -------------------------------------------------------------------------- */

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));

AvatarImage.displayName = "AvatarImage";

/* -------------------------------------------------------------------------- */
/* AVATAR FALLBACK                                                             */
/* -------------------------------------------------------------------------- */

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center",
      "rounded-full bg-muted text-sm font-medium",
      "text-muted-foreground",
      className,
    )}
    {...props}
  />
));

AvatarFallback.displayName = "AvatarFallback";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export { Avatar, AvatarImage, AvatarFallback };

export default Avatar;
