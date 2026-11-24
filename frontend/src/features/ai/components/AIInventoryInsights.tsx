import { AlertTriangle, Boxes, Lightbulb, RefreshCw } from "lucide-react";

import type { AIAnalysisResult } from "../types/ai.types";

interface AIInventoryInsightsProps {
  result?: AIAnalysisResult | null;
  loading?: boolean;
  error?: string | null;
  onGenerate?: () => void;
}

function AIInventoryInsights({
  result,
  loading = false,
  error,
  onGenerate,
}: AIInventoryInsightsProps) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <Boxes className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              AI inventory insights
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Assistive inventory trend and stock analysis.
            </p>
          </div>
        </div>

        {onGenerate && (
          <button
            type="button"
            disabled={loading}
            onClick={onGenerate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1b4564] disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Analysing..." : "Analyse inventory"}
          </button>
        )}
      </div>

      <div className="space-y-4 p-5">
        {error && (
          <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto size-8 text-muted-foreground" />

            <h3 className="mt-3 font-medium text-foreground">
              Inventory analysis not available
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Run an analysis to view insights from available inventory data.
            </p>
          </div>
        )}

        {loading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
          </div>
        )}

        {result && (
          <>
            <h3 className="font-semibold text-foreground">
              {result.title ?? "Inventory overview"}
            </h3>

            <p className="text-sm leading-6 text-muted-foreground">
              {result.summary ?? result.result ?? "No summary supplied."}
            </p>

            {result.findings?.map((finding, index) => (
              <div
                key={finding.id ?? `${finding.title}-${index}`}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {finding.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {finding.summary}
                  </p>

                  {finding.severity && (
                    <span className="mt-2 inline-block text-xs font-medium text-amber-700">
                      {finding.severity} priority
                    </span>
                  )}
                </div>
              </div>
            ))}

            {result.recommendations?.length ? (
              <div className="rounded-lg bg-muted/60 p-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Suggested review points
                </h4>

                <ul className="mt-2 space-y-2">
                  {result.recommendations.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default AIInventoryInsights;
