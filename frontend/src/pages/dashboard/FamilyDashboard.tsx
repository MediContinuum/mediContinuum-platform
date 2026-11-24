import {
  Activity,
  CalendarDays,
  Heart,
  Users,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Badge from "@/components/ui/badge";

const metrics = [
  {
    title: "Family Members",
    value: "—",
    description: "Accepted family connections",
    icon: Users,
  },
  {
    title: "Health Updates",
    value: "—",
    description: "Accessible member updates",
    icon: Activity,
  },
  {
    title: "Appointments",
    value: "—",
    description: "Shared appointment overview",
    icon: CalendarDays,
  },
  {
    title: "Pending Requests",
    value: "—",
    description: "Family connection requests",
    icon: Heart,
  },
];

function FamilyDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Family Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay connected with your family's healthcare journey.
          </p>
        </div>

        <Badge variant="info">Family Workspace</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.title}>
              <CardContent className="flex items-start justify-between p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>

                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>
              View family connections and their accessible information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <Users className="size-7 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">No family members to display</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Accepted family connections will appear here.
              </p>

              <a
                href="/family"
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Manage family connections
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Health Overview</CardTitle>
            <CardDescription>
              Health information available according to granted permissions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Activity className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Medication Adherence</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Authorized adherence summaries will be displayed here.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <CalendarDays className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Appointments</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Accessible family appointment information will appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy and Permissions</CardTitle>
          <CardDescription>
            Family healthcare access is controlled by consent and backend
            authorization.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
            <ShieldCheck className="size-6 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              You can only view information that the relevant family member has
              authorized you to access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FamilyDashboard;
