import { AlertCircle, RefreshCw } from "lucide-react";

import Button from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested information. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center ${className}`}
      role="alert"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {message}
      </p>

      {onRetry && (
        <Button className="mt-6" variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
