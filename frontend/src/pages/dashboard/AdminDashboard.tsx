import {
  Activity,
  Building2,
  ClipboardList,
  ShieldCheck,
  Users,
  UserRound,
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
    title: "Total Users",
    value: "—",
    description: "Platform-wide registered users",
    icon: Users,
  },
  {
    title: "Patients",
    value: "—",
    description: "Registered patient profiles",
    icon: UserRound,
  },
  {
    title: "Organisations",
    value: "—",
    description: "Registered healthcare organisations",
    icon: Building2,
  },
  {
    title: "System Activity",
    value: "—",
    description: "Platform activity overview",
    icon: Activity,
  },
];

const managementModules = [
  {
    title: "User Management",
    description: "Manage platform users and their access.",
    icon: Users,
    href: "/users",
  },
  {
    title: "Organisation Management",
    description: "Manage registered healthcare organisations.",
    icon: Building2,
    href: "/organisations",
  },
  {
    title: "Platform Security",
    description: "Review roles and access permissions.",
    icon: ShieldCheck,
    href: "/settings",
  },
  {
    title: "Audit Logs",
    description: "Review important platform activities.",
    icon: ClipboardList,
    href: "/audit",
  },
];

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage the MediContinuum platform.
          </p>
        </div>

        <Badge variant="info">Platform Administration</Badge>
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

      <Card>
        <CardHeader>
          <CardTitle>Platform Management</CardTitle>
          <CardDescription>
            Access the main platform administration modules.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {managementModules.map((module) => {
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Platform health and operational information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Dashboard analytics</p>
              <p className="text-sm text-muted-foreground">
                Connect the analytics and health services to display live
                platform information.
              </p>
            </div>

            <Badge variant="secondary">Awaiting API integration</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
