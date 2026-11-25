import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useAdherence } from "../hooks/useAdherence";


import AdherenceHistory from "../components/AdherenceHistory";
import { getDoseStatus } from "../types/adherence.types";

type HistoryFilter = "ALL" | "TAKEN" | "MISSED" | "SKIPPED" | "PENDING";

const FILTERS: HistoryFilter[] = [
  "ALL",
  "TAKEN",
  "MISSED",
  "SKIPPED",
  "PENDING",
];

function AdherenceHistoryPage() {
  const { schedules, isLoading, isError, error } = useAdherence();

  const [filter, setFilter] = useState<HistoryFilter>("ALL");

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const filteredDoses = useMemo(() => {
    if (filter === "ALL") {
      return schedules;
    }

    return schedules.filter((dose) => {
      const status = getDoseStatus(dose);

      if (filter === "PENDING") {
        return status === "PENDING" || status === "SCHEDULED";
      }

      return status === filter;
    });
  }, [schedules, filter]);

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading medication history...
        </p>
      </div>
    );
  }

  if (isError && schedules.length === 0) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <h2 className="font-semibold">Unable to load history</h2>

        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
          <History className="size-4" />
          Medication records
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Adherence history
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View and filter your recorded medication dose activity.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Dose records</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Filter records by their current status.
            </p>
          </div>

          <span className="text-sm text-muted-foreground">
            {filteredDoses.length} records
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                filter === item
                  ? "border-[#12304A] bg-[#12304A] text-white"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {item === "ALL"
                ? "All records"
                : item.charAt(0) + item.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </section>

      <AdherenceHistory doses={filteredDoses} timeZone={timeZone} />
    </main>
  );
}

export default AdherenceHistoryPage;