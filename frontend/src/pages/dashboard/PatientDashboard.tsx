import {
  Activity,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Package,
  Pill,
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
    title: "Active Prescriptions",
    value: "—",
    description: "Currently active prescriptions",
    icon: ClipboardList,
  },
  {
    title: "Today's Doses",
    value: "—",
    description: "Scheduled medication doses",
    icon: Pill,
  },
  {
    title: "Adherence",
    value: "—",
    description: "Medication adherence summary",
    icon: Activity,
  },
  {
    title: "Appointments",
    value: "—",
    description: "Upcoming consultations",
    icon: CalendarDays,
  },
];

const healthModules = [
  {
    title: "My Prescriptions",
    description: "View prescribed medicines and instructions.",
    icon: ClipboardList,
    href: "/prescriptions",
  },
  {
    title: "Medication Schedule",
    description: "Check your daily medication schedule.",
    icon: Pill,
    href: "/adherence",
  },
  {
    title: "Medicine Inventory",
    description: "Monitor your available medicine stock.",
    icon: Package,
    href: "/inventory",
  },
  {
    title: "Appointments",
    description: "View your scheduled consultations.",
    icon: CalendarDays,
    href: "/appointments",
  },
];

function PatientDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Patient Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal healthcare information in one place.
          </p>
        </div>

        <Badge variant="success">Patient Workspace</Badge>
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
            <CardTitle>Today's Medication</CardTitle>
            <CardDescription>
              Your medication schedule for today.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <Pill className="size-7 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">No schedule available</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Your scheduled doses will appear here after your prescription
                schedule has been generated.
              </p>

              <a
                href="/adherence"
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                View medication schedule
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Overview</CardTitle>
            <CardDescription>Your personal healthcare summary.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <HeartPulse className="size-6 text-primary" />
              <div>
                <p className="font-medium">Health Profile</p>
                <p className="text-xs text-muted-foreground">
                  View your personal health information.
                </p>
              </div>

              <a
                href="/patients"
                className="ml-auto text-sm font-medium text-primary hover:underline"
              >
                View
              </a>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Activity className="size-6 text-primary" />
              <div>
                <p className="font-medium">Adherence Summary</p>
                <p className="text-xs text-muted-foreground">
                  Review your medication adherence.
                </p>
              </div>

              <a
                href="/adherence"
                className="ml-auto text-sm font-medium text-primary hover:underline"
              >
                View
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Healthcare Services</CardTitle>
          <CardDescription>
            Access your personal healthcare modules.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          {healthModules.map((module) => {
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
    </div>
  );
}

export default PatientDashboard;
