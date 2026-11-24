import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TrendType = "positive" | "negative" | "neutral";

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    label?: string;
    type?: TrendType;
  };
  className?: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  const trendType = trend?.type ?? "neutral";

  const trendStyles: Record<TrendType, string> = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  const TrendIcon =
    trendType === "positive"
      ? ArrowUpRight
      : trendType === "negative"
        ? ArrowDownRight
        : Minus;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>

        {(description || trend) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${trendStyles[trendType]}`}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trend.value}
              </span>
            )}

            {trend?.label && (
              <span className="text-muted-foreground">{trend.label}</span>
            )}

            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;
