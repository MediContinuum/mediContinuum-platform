import { Activity, CalendarDays, Stethoscope, Users } from "lucide-react";
import type { OrganisationAnalyticsData } from "../types/analytics.types";
import ConsumptionChart from "./ConsumptionChart";

interface Props { data: OrganisationAnalyticsData }

function OrganisationAnalytics({ data }: Props) {
  const cards = [
    { label: "Total patients", value: data.totalPatients, icon: Users },
    { label: "Active patients", value: data.activePatients, icon: Activity },
    { label: "Doctors", value: data.totalDoctors, icon: Stethoscope },
    { label: "Appointments", value: data.totalAppointments, icon: CalendarDays },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-5 text-[#087E8B]" /></div>
            <p className="mt-3 text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ConsumptionChart data={data.appointmentsTrend} title="Appointment activity" />
        <ConsumptionChart data={data.patientGrowth} title="Patient growth" />
      </div>
    </div>
  );
}

export default OrganisationAnalytics;
