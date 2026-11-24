import {
  Activity,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Package,
  Pill,
  Settings,
  Users,
} from "lucide-react";

import SidebarItem from "@/components/layout/SidebarItem";

const navigationGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        end: true,
      },
      { label: "Analytics", href: "/analytics", icon: Activity },
    ],
  },
  {
    label: "HEALTHCARE",
    items: [
      { label: "Patients", href: "/patients", icon: Users },
      { label: "Doctors", href: "/doctors", icon: HeartPulse },
      { label: "Appointments", href: "/appointments", icon: CalendarDays },
      { label: "Prescriptions", href: "/prescriptions", icon: FileText },
      { label: "Medicines", href: "/medicines", icon: Pill },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Inventory", href: "/inventory", icon: Package },
      { label: "Orders", href: "/orders", icon: ClipboardList },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">MediContinuum</span>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
        {navigationGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem key={item.href} {...item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          MediContinuum Healthcare Platform
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
