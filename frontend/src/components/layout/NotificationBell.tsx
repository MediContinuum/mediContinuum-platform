import { Bell } from "lucide-react";

import Button from "@/components/ui/button";

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  label?: string;
}

function NotificationBell({
  count = 0,
  onClick,
  label = "Notifications",
}: NotificationBellProps) {
  const displayCount = count > 99 ? "99+" : count;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={count > 0 ? `${label}, ${count} unread` : label}
      className="relative"
    >
      <Bell className="h-5 w-5" />

      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
          {displayCount}
        </span>
      )}
    </Button>
  );
}

export default NotificationBell;
