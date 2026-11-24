import { IndianRupee, PackageCheck, ShoppingCart } from "lucide-react";
import type { ProcurementAnalyticsData } from "../types/analytics.types";
import ConsumptionChart from "./ConsumptionChart";

interface Props { data: ProcurementAnalyticsData }

function ProcurementAnalytics({ data }: Props) {
  const cards = [
    { label: "Total orders", value: data.totalOrders, icon: ShoppingCart },
    { label: "Pending orders", value: data.pendingOrders, icon: ShoppingCart },
    { label: "Completed orders", value: data.completedOrders, icon: PackageCheck },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-5 text-[#087E8B]" /></div>
            <p className="mt-3 text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><IndianRupee className="size-4" /> Total procurement spend</div>
        <p className="mt-2 text-2xl font-bold text-foreground">₹{data.totalSpend.toLocaleString("en-IN")}</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ConsumptionChart data={data.spendTrend} title="Procurement spend trend" />
        <ConsumptionChart data={data.ordersTrend} title="Purchase order trend" />
      </div>
    </div>
  );
}

export default ProcurementAnalytics;
