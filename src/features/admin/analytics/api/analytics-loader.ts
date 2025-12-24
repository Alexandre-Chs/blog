import { db } from '@/index'
import { visits } from '@/db/schema'
import { desc, gte } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export type TimeRange = '7d' | '30d'
export type Visit = InferSelectModel<typeof visits>
export interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  avgDuration: number
  viewsOverTime: { date: string; views: number }[]
  topPages: { path: string; views: number }[]
  referrers: { source: string; count: number }[]
}

const timeRangeSchema = z.object({
  timeRange: z.enum(['7d', '30d']),
})

export const getAnalyticsData = createServerFn({ method: 'GET' })
  .inputValidator(timeRangeSchema)
  .handler(async ({ data }) => {
    return fetchAnalyticsData(data.timeRange)
  })

function getDateRange(timeRange: TimeRange): Date {
  const now = new Date()
  const days = timeRange === '7d' ? 7 : 30
  return new Date(now.setDate(now.getDate() - days))
}

async function fetchAnalyticsData(timeRange: TimeRange): Promise<AnalyticsData> {
  const startDate = getDateRange(timeRange)

  const visitsData = await db
    .select()
    .from(visits)
    .where(gte(visits.startedAt, startDate))
    .limit(9)
    .orderBy(desc(visits.startedAt))

  const totalViews = visitsData.reduce((sum, v) => sum + (v.pageViews || 0), 0)
  const uniqueVisitors = visitsData.length
  const totalDuration = visitsData.reduce((sum, v) => sum + (v.duration || 0), 0)
  const avgDuration = uniqueVisitors > 0 ? Math.round(totalDuration / uniqueVisitors) : 0

  const viewsOverTime = calculateViewsOverTime(visitsData, timeRange)
  const topPages = calculateTopPages(visitsData)
  const referrers = calculateReferrers(visitsData)

  return {
    totalViews,
    uniqueVisitors,
    avgDuration,
    viewsOverTime,
    topPages,
    referrers,
  }
}

function calculateViewsOverTime(visitsData: Visit[], timeRange: TimeRange) {
  const days = timeRange === '7d' ? 7 : 30
  const grouped: Record<string, number> = {}

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    grouped[dateStr] = 0
  }

  visitsData.forEach((visit) => {
    const date = new Date(visit.startedAt).toISOString().split('T')[0]
    if (grouped[date] !== undefined) {
      grouped[date] += visit.pageViews || 0
    }
  })

  return Object.entries(grouped)
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function calculateTopPages(visitsData: Visit[]) {
  const pageCounts: Record<string, number> = {}

  visitsData.forEach((visit) => {
    const pages = visit.pages || []
    pages.forEach((page) => {
      pageCounts[page] = (pageCounts[page] || 0) + 1
    })
  })

  return Object.entries(pageCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

function calculateReferrers(visitsData: Visit[]) {
  const referrerCounts: Record<string, number> = {}

  visitsData.forEach((visit) => {
    if (!visit.referrer || visit.referrer === 'unknown') {
      referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + 1
    } else {
      try {
        const url = new URL(visit.referrer)
        const source = url.hostname.replace('www.', '')
        referrerCounts[source] = (referrerCounts[source] || 0) + 1
      } catch {
        referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + 1
      }
    }
  })

  return Object.entries(referrerCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}
