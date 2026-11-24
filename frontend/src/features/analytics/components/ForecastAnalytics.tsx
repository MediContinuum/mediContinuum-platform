import { AlertTriangle, TrendingUp } from "lucide-react";
import type { ForecastAnalyticsData } from "../types/analytics.types";
import ConsumptionChart from "./ConsumptionChart";

interface Props { data: ForecastAnalyticsData }

function ForecastAnalytics({ data }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp className="size-4 text-[#087E8B]" /> Projected demand</div>
          <p className="mt-3 text-2xl font-bold text-foreground">{data.projectedDemand.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Estimated for the next {data.horizonDays} days</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><AlertTriangle className="size-4 text-amber-600" /> Potential stockouts</div>
          <p className="mt-3 text-2xl font-bold text-foreground">{data.projectedStockoutItems.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Items flagged for inventory review</p>
        </div>
      </div>
      <ConsumptionChart data={data.points} title="Demand forecast" description="Historical and projected demand values supplied by the analytics service" />
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
        Forecasts are estimates, not guarantees. Verify stock, supplier lead times and clinical requirements before procurement decisions.
      </p>
    </div>
  );
}

export default ForecastAnalytics;
