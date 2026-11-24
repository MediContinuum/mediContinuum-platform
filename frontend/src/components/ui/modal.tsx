import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* MODAL ROOT                                                                  */
/* -------------------------------------------------------------------------- */

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/* MODAL OVERLAY                                                               */
/* -------------------------------------------------------------------------- */

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="modal-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));

ModalOverlay.displayName = "ModalOverlay";

/* -------------------------------------------------------------------------- */
/* MODAL CONTENT                                                               */
/* -------------------------------------------------------------------------- */

interface ModalContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />

    <DialogPrimitive.Content
      ref={ref}
      data-slot="modal-content"
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)]",
        "max-w-lg -translate-x-1/2 -translate-y-1/2",
        "gap-4 rounded-xl border border-border bg-background p-6",
        "text-foreground shadow-lg outline-none",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    >
      {children}

      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="modal-close"
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70",
            "transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "focus:ring-offset-2 disabled:pointer-events-none",
            "disabled:opacity-50",
          )}
          aria-label="Close modal"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
));

ModalContent.displayName = "ModalContent";

/* -------------------------------------------------------------------------- */
/* MODAL HEADER                                                                */
/* -------------------------------------------------------------------------- */

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-header"
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);

ModalHeader.displayName = "ModalHeader";

/* -------------------------------------------------------------------------- */
/* MODAL FOOTER                                                                */
/* -------------------------------------------------------------------------- */

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="modal-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);

ModalFooter.displayName = "ModalFooter";

/* -------------------------------------------------------------------------- */
/* MODAL TITLE                                                                 */
/* -------------------------------------------------------------------------- */

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="modal-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));

ModalTitle.displayName = "ModalTitle";

/* -------------------------------------------------------------------------- */
/* MODAL DESCRIPTION                                                           */
/* -------------------------------------------------------------------------- */

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="modal-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

ModalDescription.displayName = "ModalDescription";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
