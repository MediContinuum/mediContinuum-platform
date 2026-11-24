import { useQueryClient } from "@tanstack/react-query";
import PatientAnalytics from "../components/PatientAnalytics";
import AnalyticsPageShell from "../components/AnalyticsPageShell";
import { usePatientAnalytics, useAnalyticsPeriod } from "../hooks/useAnalytics";

function PatientAnalyticsPage() {
  const period = useAnalyticsPeriod();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = usePatientAnalytics(period);

  return (
    <AnalyticsPageShell
      title="Patient analytics"
      description="Track patient volume, active patient counts, growth and status distribution."
      isLoading={isLoading}
      error={error}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ["analytics"] })}
    >
      {data ? <PatientAnalytics data={data} /> : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No analytics data was returned for this period.
        </div>
      )}
    </AnalyticsPageShell>
  );
}

export default PatientAnalyticsPage;
