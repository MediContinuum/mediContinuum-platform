import type { ReactNode } from "react";
import { Inbox, Plus, RefreshCw } from "lucide-react";

import Button from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center ${className}`}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>

      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
