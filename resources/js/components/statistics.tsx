  "use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const emptyData: { date: string; sales: number }[] = []

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#3242a8",
  },
} satisfies ChartConfig

export function Statistics() {
  const [data, setData] = useState(emptyData)

  useEffect(() => {
    let cancelled = false

    fetch('/reports/sales-by-day')
      .then((r) => r.json())
      .then((arr) => {
        if (cancelled) return
        // map API { date: 'YYYY-MM-DD', total: number } -> { date, sales }
        const mapped = (arr ?? []).map((d: any) => ({ date: d.date, sales: Number(d.total ?? 0) }))
        setData(mapped)
      })
      .catch(() => {
        if (cancelled) return
        setData(emptyData)
      })

    return () => { cancelled = true }
  }, [])

  return (
    <Card>
      <CardHeader>
        
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data.map((d) => ({ month: d.date, sales: d.sales }))}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sales"
              type="natural"
              stroke="var(--color-sales, #3b82f6)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
