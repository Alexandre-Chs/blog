import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

export function RefererChart({ data }: { data: { source: string; count: number }[] }) {
  const chartConfig = {
    visitors: {
      label: 'Visitors',
      color: 'var(--chart-2)',
    },
    label: {
      color: 'var(--foreground)',
    },
  } satisfies ChartConfig

  const formattedData = data.map((item) => ({
    source: item.source,
    visitors: item.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referrers</CardTitle>
        <CardDescription>Traffic sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-x-2">
          <div className="flex items-center justify-between [&>div]:text-sm [&>div]:text-muted-foreground [&>div]:mb-2">
            <div>Source</div>
            <div>Visitors</div>
          </div>
          <div className="flex gap-x-2">
            <ChartContainer config={chartConfig} className="flex flex-1" style={{ height: formattedData.length * 40 }}>
              <BarChart
                accessibilityLayer
                data={formattedData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <YAxis
                  dataKey="source"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={120}
                  hide
                  domain={[0, 'dataMax']}
                />
                <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="visitors" fill="var(--chart-2)" radius={4} barSize={30}>
                  <LabelList
                    dataKey="source"
                    position="insideLeft"
                    offset={8}
                    className="fill-foreground font-medium"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
            <div
              className="flex flex-col gap-y-2 items-start mt-1 shrink-0"
              style={{ height: formattedData.length * 40 }}
            >
              {formattedData.map((item) => (
                <span
                  key={item.source}
                  className="h-[30px] w-[50px] flex items-center justify-center font-medium text-sm"
                >
                  {item.visitors.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
