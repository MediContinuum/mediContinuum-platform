import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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

interface LineChartProps {
  data: ChartData[];
  title?: string;
  description?: string;
  xKey?: string;
  dataKey?: string;
  lineColor?: string;
  height?: number;
  valueSuffix?: string;
}

function LineChart({
  data,
  title = "Adherence Trends",
  description = "Track medicine adherence over time",
  xKey = "month",
  dataKey = "adherence",
  lineColor = "var(--primary)",
  height = 300,
  valueSuffix = "%",
}: LineChartProps) {
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
            No adherence data available.
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
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
                    "Adherence",
                  ]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={lineColor}
                  strokeWidth={3}
                  dot={{ r: 4, fill: lineColor }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LineChart;
