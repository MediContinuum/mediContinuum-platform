import {
  Activity,
  Building2,
  CalendarDays,
  ClipboardList,
  Stethoscope,
  Users,
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
    title: "Organisation Members",
    value: "—",
    description: "Registered organisation members",
    icon: Users,
  },
  {
    title: "Doctors",
    value: "—",
    description: "Associated healthcare professionals",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    value: "—",
    description: "Organisation-associated patients",
    icon: Activity,
  },
  {
    title: "Appointments",
    value: "—",
    description: "Organisation appointment overview",
    icon: CalendarDays,
  },
];

const modules = [
  {
    title: "Members",
    description: "View and manage organisation members.",
    icon: Users,
    href: "/organisation/members",
  },
  {
    title: "Doctors",
    description: "Manage associated doctors.",
    icon: Stethoscope,
    href: "/doctors",
  },
  {
    title: "Patients",
    description: "Access authorised patient records.",
    icon: Activity,
    href: "/patients",
  },
  {
    title: "Appointments",
    description: "Review organisation appointments.",
    icon: CalendarDays,
    href: "/appointments",
  },
];

function OrganisationDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Organisation Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your healthcare organisation and operations.
          </p>
        </div>

        <Badge variant="info">Organisation Workspace</Badge>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Building2 className="size-7" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Organisation Overview</h2>
            <p className="text-sm text-muted-foreground">
              Organisation profile information will be loaded from the
              organisation API.
            </p>
          </div>
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle>Organisation Modules</CardTitle>
          <CardDescription>
            Access your organisation's operational modules.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <a
                key={module.title}
                href={module.href}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </a>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Activity</CardTitle>
          <CardDescription>
            Organisation-level operational insights.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="mb-3 size-8 text-muted-foreground" />
            <h3 className="font-semibold">Analytics not connected</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Operational metrics will be available after the organisation
              analytics API is implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrganisationDashboard;
