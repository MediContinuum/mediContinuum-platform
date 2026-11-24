interface AdherenceProgressProps {
  percentage: number;
  label?: string;
  description?: string;
}

function AdherenceProgress({
  percentage,
  label = "Medication adherence",
  description,
}: AdherenceProgressProps) {
  const safePercentage = Math.min(
    100,
    Math.max(0, Number.isFinite(percentage) ? percentage : 0),
  );

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
          {safePercentage.toFixed(1)}%
        </span>
      </div>

      <div
        className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={safePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-[#087E8B] transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {safePercentage >= 90
          ? "Excellent adherence progress."
          : safePercentage >= 70
            ? "Good progress. Keep following your prescribed schedule."
            : "Review your medication schedule and follow your clinician's instructions."}
      </p>
    </section>
  );
}

export default AdherenceProgress;
