import { useQueryClient } from "@tanstack/react-query";
import OrganisationAnalytics from "../components/OrganisationAnalytics";
import AnalyticsPageShell from "../components/AnalyticsPageShell";
import { useOrganisationAnalytics, useAnalyticsPeriod } from "../hooks/useAnalytics";

function OrganisationAnalyticsPage() {
  const period = useAnalyticsPeriod();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useOrganisationAnalytics(period);

  return (
    <AnalyticsPageShell
      title="Organisation analytics"
      description="Review organisation-wide patient activity, appointments and service trends."
      isLoading={isLoading}
      error={error}
      onRefresh={() => queryClient.invalidateQueries({ queryKey: ["analytics"] })}
    >
      {data ? <OrganisationAnalytics data={data} /> : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No analytics data was returned for this period.
        </div>
      )}
    </AnalyticsPageShell>
  );
}

export default OrganisationAnalyticsPage;
