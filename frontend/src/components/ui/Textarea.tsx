import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      disabled = false,
      readOnly = false,
      required = false,
      autoResize = false,
      minRows = 3,
      maxRows = 8,
      rows,
      onChange,
      onInput,
      ...props
    },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (element: HTMLTextAreaElement | null) => {
        internalRef.current = element;

        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref],
    );

    const resizeTextarea = React.useCallback(() => {
      const element = internalRef.current;
      if (!element || !autoResize) return;

      element.style.height = "auto";

      const computedStyle = window.getComputedStyle(element);
      const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 20;
      const padding =
        Number.parseFloat(computedStyle.paddingTop) +
        Number.parseFloat(computedStyle.paddingBottom);
      const border =
        Number.parseFloat(computedStyle.borderTopWidth) +
        Number.parseFloat(computedStyle.borderBottomWidth);

      const minHeight = lineHeight * minRows + padding + border;
      const maxHeight = lineHeight * maxRows + padding + border;

      element.style.height = `${Math.min(
        Math.max(element.scrollHeight, minHeight),
        maxHeight,
      )}px`;

      element.style.overflowY =
        element.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoResize, minRows, maxRows]);

    React.useEffect(() => {
      resizeTextarea();
    }, [resizeTextarea, props.value, props.defaultValue]);

    return (
      <textarea
        {...props}
        ref={setRefs}
        data-slot="textarea"
        rows={rows ?? minRows}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-required={required || undefined}
        onChange={(event) => {
          onChange?.(event);
          resizeTextarea();
        }}
        onInput={(event) => {
          onInput?.(event);
          resizeTextarea();
        }}
        className={cn(
          [
            "flex min-h-20 w-full min-w-0 rounded-md",
            "border border-input bg-background",
            "px-3 py-2 text-sm text-foreground shadow-xs",
            "outline-none transition-[color,background-color,border-color,box-shadow]",
            "duration-200 ease-out",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px]",
            "focus-visible:ring-ring/50",
            "aria-invalid:border-destructive",
            "aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
            "disabled:pointer-events-none disabled:cursor-not-allowed",
            "disabled:opacity-50",
            "read-only:cursor-default read-only:bg-muted/50",
            "resize-y",
          ],
          autoResize && "resize-none",
          className,
        )}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
