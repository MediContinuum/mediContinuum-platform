import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
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

interface ProgressChartData {
  label: string;
  value: number;
}

interface ProgressChartProps {
  data: ProgressChartData[];
  title?: string;
  description?: string;
  height?: number;
  barColor?: string;
  showValues?: boolean;
}

function ProgressChart({
  data,
  title = "Completion Progress",
  description = "Track completion percentages",
  height = 300,
  barColor = "var(--primary)",
  showValues = true,
}: ProgressChartProps) {
  const normalizedData = data.map((item) => ({
    ...item,
    value: Math.min(100, Math.max(0, item.value)),
  }));

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
            No progress data available.
          </div>
        ) : (
          <div style={{ width: "100%", height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={normalizedData}
                layout="vertical"
                margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value: number) => `${value}%`}
                />

                <YAxis
                  type="category"
                  dataKey="label"
                  width={100}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />

                <Tooltip
                  formatter={(value) => [`${value ?? 0}%`, "Completion"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />

                <Bar
                  dataKey="value"
                  background={{ fill: "var(--muted)", radius: 5 }}
                  radius={[0, 5, 5, 0]}
                  maxBarSize={25}
                >
                  {normalizedData.map((item, index) => (
                    <Cell key={`${item.label}-${index}`} fill={barColor} />
                  ))}

                  {showValues && (
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(value) => `${value}%`}
                      style={{
                        fill: "var(--foreground)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProgressChart;
