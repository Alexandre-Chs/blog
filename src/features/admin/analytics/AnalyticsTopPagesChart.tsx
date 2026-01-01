import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import type { ChartConfig} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function AnalyticsTopPagesChart({ data }: { data: Array<{ path: string; views: number }> }) {
  const chartConfig = {
    visitors: {
      label: 'Visitors',
      color: 'var(--chart-1)',
    },
    label: {
      color: 'var(--foreground)',
    },
  } satisfies ChartConfig

  const formattedData = data.map((item) => ({
    page: item.path === '/' ? 'Home' : item.path.slice(1),
    visitors: item.views,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-x-2">
          <div className="flex items-center justify-between [&>div]:text-sm [&>div]:text-muted-foreground [&>div]:mb-2">
            <div>Pages</div>
            <div>Visitors</div>
          </div>
          <div className="flex gap-x-2">
            <ChartContainer
              config={chartConfig}
              className="flex flex-1 aspect-auto"
              style={{ height: formattedData.length * 40 }}
            >
              <BarChart
                accessibilityLayer
                data={formattedData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <YAxis
                  dataKey="page"
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
                <Bar dataKey="visitors" fill="var(--chart-1)" radius={4} barSize={30}>
                  <LabelList
                    dataKey="page"
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
                  key={item.page}
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
