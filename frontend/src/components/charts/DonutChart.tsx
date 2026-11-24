import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DonutChartData {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  title?: string;
  description?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

const DEFAULT_COLORS = [
  "#0f766e",
  "#2563eb",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
];

function DonutChart({
  data,
  title = "Inventory Breakdown",
  description = "Medicine inventory distribution",
  height = 300,
  innerRadius = 65,
  outerRadius = 95,
  showLegend = true,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 || total === 0 ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height }}
          >
            No inventory data available.
          </div>
        ) : (
          <div className="relative" style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  paddingAngle={3}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`${item.name}-${index}`}
                      fill={
                        item.color ??
                        DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`${value ?? 0}`, String(name)]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />

                {showLegend && (
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                  />
                )}
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">Total Items</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DonutChart;
