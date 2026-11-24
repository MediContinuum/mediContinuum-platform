import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import type { AIAnomaly } from "../types/ai.types";

interface AnomalyDetectionPanelProps {
  anomalies?: AIAnomaly[];
  loading?: boolean;
  error?: string | null;
  onRunDetection?: () => void;
}

const severityStyles: Record<string, string> = {
  LOW: "bg-sky-50 text-sky-700 border-sky-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

function AnomalyDetectionPanel({
  anomalies = [],
  loading = false,
  error,
  onRunDetection,
}: AnomalyDetectionPanelProps) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <ShieldAlert className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">Anomaly detection</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review unusual patterns flagged for human assessment.
            </p>
          </div>
        </div>

        {onRunDetection && (
          <button
            type="button"
            onClick={onRunDetection}
            disabled={loading}
            className="rounded-lg bg-[#12304A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1b4564] disabled:opacity-50"
          >
            {loading ? "Checking..." : "Run detection"}
          </button>
        )}
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
          </div>
        ) : anomalies.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto size-8 text-emerald-600" />

            <p className="mt-3 font-medium text-foreground">
              No anomaly records to display
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              This does not establish that all activity is normal. Run detection
              when data is available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <article
                key={anomaly.id}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {anomaly.title}
                    </h3>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                        severityStyles[anomaly.severity] ??
                        "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {anomaly.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {anomaly.description}
                  </p>

                  {anomaly.recommendation && (
                    <p className="mt-2 text-sm text-foreground">
                      Review: {anomaly.recommendation}
                    </p>
                  )}

                  {anomaly.detectedAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Detected: {anomaly.detectedAt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          Anomaly flags are review signals, not proof of an error, fraud or
          medical problem.
        </div>
      </div>
    </section>
  );
}

export default AnomalyDetectionPanel;
