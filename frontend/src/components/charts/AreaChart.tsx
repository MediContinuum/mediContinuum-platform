import {
  Area,
  AreaChart as RechartsAreaChart,
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

interface AreaChartProps {
  data: ChartData[];
  title?: string;
  description?: string;
  xKey?: string;
  dataKey?: string;
  areaColor?: string;
  height?: number;
  valueSuffix?: string;
}

function AreaChart({
  data,
  title = "Historical Trends",
  description = "View historical healthcare activity",
  xKey = "month",
  dataKey = "value",
  areaColor = "var(--primary)",
  height = 300,
  valueSuffix = "",
}: AreaChartProps) {
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
            No historical data available.
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={data}
                margin={{ top: 10, right: 12, left: -15, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="historicalAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={areaColor}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={areaColor}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

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
                    "Value",
                  ]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={areaColor}
                  strokeWidth={2.5}
                  fill="url(#historicalAreaGradient)"
                  activeDot={{ r: 5 }}
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AreaChart;
