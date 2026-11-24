import { useQueryClient } from "@tanstack/react-query";
import InventoryAnalytics from "../components/InventoryAnalytics";
import AnalyticsPageShell from "../components/AnalyticsPageShell";
import { useInventoryAnalytics, useAnalyticsPeriod } from "../hooks/useAnalytics";

function InventoryAnalyticsPage() {
  const period = useAnalyticsPeriod();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useInventoryAnalytics(period);

  return (
    <AnalyticsPageShell
      title="Inventory analytics"
      description="Monitor stock levels, low-stock items, expiry exposure and inventory movement."
      isLoading={isLoading}
      error={error}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ["analytics"] })}
    >
      {data ? <InventoryAnalytics data={data} /> : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No analytics data was returned for this period.
        </div>
      )}
    </AnalyticsPageShell>
  );
}

export default InventoryAnalyticsPage;
