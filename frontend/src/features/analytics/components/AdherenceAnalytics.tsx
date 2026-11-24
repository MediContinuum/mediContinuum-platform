import { CheckCircle2, Clock3, Pill } from "lucide-react";
import type { AdherenceAnalyticsData } from "../types/analytics.types";
import ConsumptionChart from "./ConsumptionChart";

interface Props { data: AdherenceAnalyticsData }

function AdherenceAnalytics({ data }: Props) {
  const metrics = [
    { label: "Adherence rate", value: `${data.adherenceRate}%`, icon: CheckCircle2 },
    { label: "Doses taken", value: data.takenDoses.toLocaleString(), icon: Pill },
    { label: "Missed doses", value: data.missedDoses.toLocaleString(), icon: Clock3 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-5 text-[#087E8B]" />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <ConsumptionChart data={data.trend} title="Adherence trend" description={`${data.scheduledDoses.toLocaleString()} doses scheduled in this period`} />
    </div>
  );
}

export default AdherenceAnalytics;
