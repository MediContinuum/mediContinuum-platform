import {
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
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
    title: "My Patients",
    value: "—",
    description: "Patients assigned to you",
    icon: UserRound,
  },
  {
    title: "Appointments",
    value: "—",
    description: "Scheduled appointments",
    icon: CalendarDays,
  },
  {
    title: "Prescriptions",
    value: "—",
    description: "Prescriptions issued",
    icon: FileText,
  },
  {
    title: "Pending Reviews",
    value: "—",
    description: "Items requiring attention",
    icon: ClipboardList,
  },
];

const quickActions = [
  {
    title: "View Patients",
    description: "Access patient profiles and medical information.",
    icon: UserRound,
    href: "/patients",
  },
  {
    title: "Appointments",
    description: "View and manage scheduled consultations.",
    icon: CalendarDays,
    href: "/appointments",
  },
  {
    title: "Prescriptions",
    description: "Create and review prescriptions.",
    icon: FileText,
    href: "/prescriptions",
  },
  {
    title: "Adherence",
    description: "Review patient medication adherence.",
    icon: ClipboardList,
    href: "/adherence",
  },
];

function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Doctor Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your patients, consultations and prescriptions.
          </p>
        </div>

        <Badge variant="info">Doctor Workspace</Badge>
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used doctor workspace modules.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a
                  key={action.title}
                  href={action.href}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Icon className="mb-3 size-5 text-primary" />
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </a>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your upcoming patient consultations.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <CalendarDays className="size-7 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">No appointment data</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Appointment information will appear here once the appointment
                API is connected.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Overview</CardTitle>
          <CardDescription>
            Patient care and prescription activity.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Clock className="size-5 text-primary" />
            <div>
              <p className="font-medium">Consultation Activity</p>
              <p className="text-xs text-muted-foreground">
                Waiting for appointment analytics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <ClipboardList className="size-5 text-primary" />
            <div>
              <p className="font-medium">Prescription Activity</p>
              <p className="text-xs text-muted-foreground">
                Waiting for prescription analytics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorDashboard;
