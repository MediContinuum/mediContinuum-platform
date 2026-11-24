import type { AnalyticsPoint } from "../types/analytics.types";

interface ConsumptionChartProps {
  data: AnalyticsPoint[];
  title?: string;
  description?: string;
}

function ConsumptionChart({
  data,
  title = "Medicine consumption",
  description = "Consumption over the selected period",
}: ConsumptionChartProps) {
  const maxValue = Math.max(1, ...data.map((point) => point.value));

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No chart data available.</p>
      ) : (
        <div className="mt-6 flex h-56 items-end gap-2 overflow-x-auto pb-7">
          {data.map((point, index) => (
            <div key={`${point.label}-${index}`} className="flex min-w-8 flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] text-muted-foreground">{point.value}</span>
              <div
                className="w-full max-w-10 rounded-t-md bg-[#087E8B] transition-all"
                style={{ height: `${Math.max(4, (point.value / maxValue) * 150)}px` }}
                title={`${point.label}: ${point.value}`}
              />
              <span className="max-w-12 truncate text-[10px] text-muted-foreground">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ConsumptionChart;
