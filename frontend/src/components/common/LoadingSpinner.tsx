interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
  xl: "h-12 w-12 border-4",
};

function LoadingSpinner({
  size = "md",
  label = "Loading...",
  fullScreen = false,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen w-full" : "py-6"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`animate-spin rounded-full border-primary/20 border-t-primary ${sizeClasses[size]}`}
        aria-hidden="true"
      />

      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

export default LoadingSpinner;
