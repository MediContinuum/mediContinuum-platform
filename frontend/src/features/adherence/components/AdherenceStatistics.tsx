import {
  Activity,
  CheckCircle2,
  Clock3,
  ListChecks,
  XCircle,
} from "lucide-react";

import type {
  AdherenceSummaryView,
  MedicationDose,
} from "../types/adherence.types";

import { getDoseStatus } from "../types/adherence.types";

import AdherenceProgress from "./AdherenceProgress";

interface AdherenceStatisticsProps {
  summary?: AdherenceSummaryView | null;
  doses?: MedicationDose[];
}

function AdherenceStatistics({
  summary,
  doses = [],
}: AdherenceStatisticsProps) {
  const taken =
    summary?.takenDoses ??
    doses.filter((dose) => getDoseStatus(dose) === "TAKEN").length;

  const missed =
    summary?.missedDoses ??
    doses.filter((dose) => getDoseStatus(dose) === "MISSED").length;

  const skipped =
    summary?.skippedDoses ??
    doses.filter((dose) => getDoseStatus(dose) === "SKIPPED").length;

  const pending =
    summary?.pendingDoses ??
    doses.filter((dose) =>
      ["PENDING", "SCHEDULED"].includes(getDoseStatus(dose)),
    ).length;

  const total = summary?.totalDoses ?? doses.length;

  const calculatedPercentage = total > 0 ? (taken / total) * 100 : 0;

  const percentage =
    summary?.adherencePercentage ??
    summary?.completionRate ??
    calculatedPercentage;

  const statistics = [
    {
      title: "Total doses",
      value: total,
      description: "Scheduled doses",
      icon: ListChecks,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      title: "Taken",
      value: taken,
      description: "Recorded as taken",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Missed",
      value: missed,
      description: "Recorded as missed",
      icon: XCircle,
      iconClass: "bg-rose-50 text-rose-700",
    },
    {
      title: "Pending",
      value: pending,
      description: "Awaiting action",
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
        percentage={percentage}
        label="Overall adherence"
        description="Calculated from the available medication dose records."
      />

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <Activity className="size-5 text-[#087E8B]" />

        <div>
          <p className="text-sm font-semibold text-foreground">
            Skipped doses: {skipped}
          </p>

          <p className="text-xs text-muted-foreground">
            Doses explicitly recorded as skipped.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdherenceStatistics;
