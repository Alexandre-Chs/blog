import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Clock, Eye, Users } from 'lucide-react'
import { getAnalyticsData, type TimeRange } from '../api/analytics-loader'
import { TopPagesChart } from '../components/TopPagesChart'
import { RefererChart } from '../components/RefererChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NavigationName from '@/components/ui/navigation-name'
import { ViewsChart } from '../components/ViewsChart'
import { ChartSkeleton } from '../components/SkeletonChart'
import { StatCardSkeleton } from '../components/StatCardSkeleton'
import { currentVisitors } from '../api/api'

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Eye }) {
  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
    return val.toString()
  }

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {title === 'Avg. Duration' ? formatDuration(value) : formatValue(value)}
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const getAnalyticsDataFn = useServerFn(getAnalyticsData)
  const getCurrentVisitorsFn = useServerFn(currentVisitors)

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => getAnalyticsDataFn({ data: { timeRange } }),
  })

  const { data: visitors } = useQuery({
    queryKey: ['currentVisitors'],
    queryFn: () => getCurrentVisitorsFn(),
    refetchInterval: 60 * 1000,
  })

  return (
    <>
      <NavigationName name="Analytics" subtitle="Track your blog performance and visitor insights" />
      <div className="px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-x-2 text-muted-foreground text-sm">
            <span className="h-2 w-2 block rounded-full bg-green-500"></span>
            {visitors} current visitors
          </div>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <TabsList>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Views" value={data.totalViews} icon={Eye} />
            <StatCard title="Unique Visitors" value={data.uniqueVisitors} icon={Users} />
            <StatCard title="Avg. Duration" value={data.avgDuration} icon={Clock} />
          </div>
        ) : null}

        {isLoading ? <ChartSkeleton /> : data ? <ViewsChart data={data.viewsOverTime} /> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : data ? (
            <>
              <RefererChart data={data.referrers} />
              <TopPagesChart data={data.topPages} />
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
