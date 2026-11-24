import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
} from "lucide-react";

import type { AIAnalysisResult } from "../types/ai.types";
import { AI_MEDICAL_DISCLAIMER } from "../types/ai.types";

interface AIAdherenceInsightsProps {
  result?: AIAnalysisResult | null;
  loading?: boolean;
  error?: string | null;
  onGenerate?: () => void;
}

function AIAdherenceInsights({
  result,
  loading = false,
  error,
  onGenerate,
}: AIAdherenceInsightsProps) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#E5F3F4] text-[#087E8B]">
            <Activity className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              AI adherence insights
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Assistive analysis of medication adherence records.
            </p>
          </div>
        </div>

        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#12304A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1b4564] disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Analysing..." : "Generate insights"}
          </button>
        )}
      </div>

      <div className="space-y-4 p-5">
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            {error}
          </div>
        )}

        {!result && !loading && !error && (
          <div className="py-8 text-center">
            <Lightbulb className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 font-medium text-foreground">
              No insights generated yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Generate an analysis after connecting medication adherence data.
            </p>
          </div>
        )}

        {loading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
          </div>
        )}

        {result && (
          <>
            <div>
              <h3 className="font-semibold text-foreground">
                {result.title ?? "Adherence overview"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {result.summary ?? result.result ?? "No summary supplied."}
              </p>
            </div>

            {result.findings?.map((finding, index) => (
              <article
                key={finding.id ?? `${finding.title}-${index}`}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#087E8B]" />

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {finding.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {finding.summary}
                    </p>

                    {finding.details && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {finding.details}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="rounded-lg bg-[#E5F3F4] p-4">
                <h4 className="font-semibold text-[#12304A]">
                  Points for review
                </h4>

                <ul className="mt-3 space-y-2">
                  {result.recommendations.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm text-slate-700"
                    >
                      <span>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <p className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
          {result?.disclaimer ?? AI_MEDICAL_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}

export default AIAdherenceInsights;
