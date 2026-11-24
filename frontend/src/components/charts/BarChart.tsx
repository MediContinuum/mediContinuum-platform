import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartData = Record<string, string | number>;

interface BarChartProps {
  data: ChartData[];
  title?: string;
  description?: string;
  xKey?: string;
  dataKey?: string;
  barColor?: string;
  height?: number;
  valueSuffix?: string;
}

function BarChart({
  data,
  title = "Monthly Medicine Usage",
  description = "Medicine consumption over the selected period",
  xKey = "month",
  dataKey = "usage",
  barColor = "var(--primary)",
  height = 300,
  valueSuffix = "",
}: BarChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height }}
          >
            No medicine usage data available.
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={data}
                margin={{ top: 10, right: 12, left: -15, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey={xKey}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value: number) => `${value}${valueSuffix}`}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value ?? 0}${valueSuffix}`,
                    "Usage",
                  ]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />

                <Bar
                  dataKey={dataKey}
                  fill={barColor}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={55}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BarChart;
