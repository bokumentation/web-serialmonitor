"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useDataStore } from "@/store/useDataStore"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface RealTimeLineChartProps {
  dataKey: string
  title: string
}

export function RealTimeLineChart({ dataKey, title }: RealTimeLineChartProps) {
  const history = useDataStore((state) => state.history)

  // This config object is what shadcn uses to map CSS variables to the chart
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: "var(--chart-1)", // Uses the oklch color from your index.css
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-sm font-semibold uppercase">{title}</CardTitle>
          <CardDescription>
            Real-time sensor data from ESP32
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={history}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              domain={['auto', 'auto']}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString()
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey={dataKey}
              type="monotone"
              stroke={`var(--color-${dataKey})`} // Matches the key in chartConfig
              strokeWidth={2}
              dot={false}
              isAnimationActive={false} // Required for high-speed hardware data
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}