import {
  Activity,
  CheckCircle2,
  Clock3,
  ListChecks,
  XCircle,
} from "lucide-react";

import type { AdherenceSummaryView } from "../types/adherence.types";

import AdherenceProgress from "./AdherenceProgress";

interface AdherenceStatisticsProps {
  summary?: AdherenceSummaryView | null;
}

/**
 * Presentation-only adherence summary.
 *
 * Counts and the adherence percentage are supplied by the backend summary
 * endpoint. This component deliberately does not count dose statuses or
 * calculate an adherence rate in the browser.
 */
function AdherenceStatistics({ summary }: AdherenceStatisticsProps) {
  const statistics = [
    {
      title: "Total doses",
      value: summary?.totalDoses?.toLocaleString() ?? "—",
      description: "Reported by the adherence service",
      icon: ListChecks,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      title: "Taken",
      value: summary?.takenDoses?.toLocaleString() ?? "—",
      description: "Reported as taken",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Missed",
      value: summary?.missedDoses?.toLocaleString() ?? "—",
      description: "Reported as missed",
      icon: XCircle,
      iconClass: "bg-rose-50 text-rose-700",
    },
    {
      title: "Pending",
      value: summary?.pendingDoses?.toLocaleString() ?? "—",
      description: "Reported as pending",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${item.iconClass}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>

      <AdherenceProgress
        percentage={summary?.adherencePercentage}
        label="Overall adherence"
        description="Percentage returned by the adherence service."
      />

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <Activity className="size-5 text-[#087E8B]" />

        <div>
          <p className="text-sm font-semibold text-foreground">
            Skipped doses: {summary?.skippedDoses?.toLocaleString() ?? "—"}
          </p>

          <p className="text-xs text-muted-foreground">
            Count supplied by the adherence service.
          </p>
        </div>
      </div>

      {!summary && (
        <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          No adherence summary was returned. Statistics are not estimated from
          individual dose records in the browser.
        </p>
      )}
    </div>
  );
}

export default AdherenceStatistics;
