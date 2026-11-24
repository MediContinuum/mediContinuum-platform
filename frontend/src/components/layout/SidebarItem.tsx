import { NavLink } from "react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function SidebarItem({
  label,
  href,
  icon: Icon,
  end = false,
  onClick,
  collapsed = false,
}: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      end={end}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

export default SidebarItem;
