interface AdherenceProgressProps {
  percentage?: number | null;
  label?: string;
  description?: string;
}

/**
 * Displays a percentage supplied by the adherence API.
 *
 * The browser only formats the value and sizes the progress indicator. It
 * does not assign adherence bands, calculate clinical thresholds, or make
 * recommendations based on the percentage.
 */
function AdherenceProgress({
  percentage,
  label = "Medication adherence",
  description,
}: AdherenceProgressProps) {
  const hasPercentage =
    typeof percentage === "number" && Number.isFinite(percentage);

  // Clamp only for safe visual rendering; never change the API value itself.
  const safePercentage = hasPercentage
    ? Math.min(100, Math.max(0, percentage))
    : 0;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{label}</h3>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <span className="text-2xl font-bold text-[#087E8B]">
          {hasPercentage ? `${safePercentage.toFixed(1)}%` : "—"}
        </span>
      </div>

      <div
        className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={hasPercentage ? safePercentage : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        aria-valuetext={
          hasPercentage
            ? `${safePercentage.toFixed(1)} percent`
            : "No percentage reported"
        }
      >
        <div
          className="h-full rounded-full bg-[#087E8B] transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      {!hasPercentage && (
        <p className="mt-3 text-xs text-muted-foreground">
          The adherence service has not supplied a percentage for this period.
        </p>
      )}
    </section>
  );
}

export default AdherenceProgress;
