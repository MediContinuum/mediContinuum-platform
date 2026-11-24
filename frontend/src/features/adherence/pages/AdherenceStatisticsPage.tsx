import { Activity, ChartNoAxesCombined } from "lucide-react";

import { useAdherence } from "../hooks/useAdherence";

import AdherenceStatistics from "../components/AdherenceStatistics";

/** Displays the adherence summary returned by the backend API. */
function AdherenceStatisticsPage() {
  const { summary, isLoading, isError, error, refetch } =
    useAdherence();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading adherence statistics...
        </p>
      </div>
    );
  }

  if (isError && schedules.length === 0 && !summary) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        <h2 className="font-semibold">Unable to load adherence statistics</h2>

        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]">
            <ChartNoAxesCombined className="size-4" />
            Medication analytics
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            Adherence statistics
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Understand your medication-taking activity through recorded schedule
            data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Activity className="size-4" />
          Refresh
        </button>
      </header>

      {/* Render only the authoritative aggregate returned by the API. */}
      <AdherenceStatistics summary={summary} />

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground">
          Understanding your statistics
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Aggregate totals and adherence percentages are calculated by the
          backend and displayed as returned. Individual medication records are
          not used to reconstruct summary metrics in the browser. These records
          describe recorded activity and are not a clinical assessment.
        </p>
      </section>
    </main>
  );
}

export default AdherenceStatisticsPage;
