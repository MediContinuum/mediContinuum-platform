import { useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, BarChart3, RefreshCw } from "lucide-react";
import type { AnalyticsPeriod } from "../types/analytics.types";

interface AnalyticsPageShellProps {
  title: string;
  description: string;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  children: ReactNode;
}

function AnalyticsPageShell({
  title, description, isLoading, error, onRefresh, children,
}: AnalyticsPageShellProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#087E8B]"><BarChart3 className="size-4" /> Analytics</div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Analytics period" value={period} onChange={(event) => {
            const next = event.target.value as AnalyticsPeriod;
            setPeriod(next);
            window.dispatchEvent(new CustomEvent("analytics-period-change", { detail: next }));
          }} className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button type="button" onClick={onRefresh} disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50">
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </header>
      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div><p className="font-semibold">Unable to load analytics</p><p className="mt-1">{error.message}</p><p className="mt-2 text-xs">Confirm that the analytics API is running and the endpoint is available.</p></div>
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading analytics…</div>
      ) : children}
    </main>
  );
}

export default AnalyticsPageShell;
