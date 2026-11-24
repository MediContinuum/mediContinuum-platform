import type { ReactNode } from "react";
import { Circle } from "lucide-react";

import Badge from "@/components/ui/badge";

type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"
  | "failed"
  | "processing"
  | "verified"
  | "suspended"
  | "expired"
  | "draft";

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  showDot?: boolean;
  icon?: ReactNode;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "info"
      | "ghost";
    label: string;
  }
> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "secondary", label: "Inactive" },
  pending: { variant: "warning", label: "Pending" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "destructive", label: "Rejected" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "secondary", label: "Cancelled" },
  failed: { variant: "destructive", label: "Failed" },
  processing: { variant: "info", label: "Processing" },
  verified: { variant: "success", label: "Verified" },
  suspended: { variant: "destructive", label: "Suspended" },
  expired: { variant: "secondary", label: "Expired" },
  draft: { variant: "outline", label: "Draft" },
};

function StatusBadge({
  status,
  label,
  showDot = true,
  icon,
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const config = statusConfig[normalizedStatus] ?? {
    variant: "outline" as const,
    label: status,
  };

  return (
    <Badge variant={config.variant} className={className}>
      {icon ??
        (showDot && (
          <Circle className="mr-1 h-2 w-2 fill-current" aria-hidden="true" />
        ))}
      {label ?? config.label}
    </Badge>
  );
}

export default StatusBadge;
