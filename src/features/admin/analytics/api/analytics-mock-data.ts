export type TimeRange = '7d' | '30d'

export interface Stats {
  totalViews: number
  viewsChange: number
  uniqueVisitors: number
  visitorsChange: number
  bounceRate: number
  bounceRateChange: number
  avgDuration: number
  durationChange: number
}

export interface ViewsOverTimeData {
  date: string
  views: number
}

export interface TopPage {
  path: string
  views: number
}

export interface Referrer {
  source: string
  count: number
}

export const mockStats: Record<TimeRange, Stats> = {
  '7d': {
    totalViews: 12453,
    viewsChange: 12.5,
    uniqueVisitors: 3821,
    visitorsChange: 8.3,
    bounceRate: 42.5,
    bounceRateChange: -3.2,
    avgDuration: 245,
    durationChange: 5.8,
  },
  '30d': {
    totalViews: 48792,
    viewsChange: 24.1,
    uniqueVisitors: 15234,
    visitorsChange: 18.7,
    bounceRate: 38.2,
    bounceRateChange: -5.4,
    avgDuration: 312,
    durationChange: 11.2,
  },
}

export const mockViewsOverTime: Record<TimeRange, ViewsOverTimeData[]> = {
  '7d': [
    { date: '2025-12-18', views: 1523 },
    { date: '2025-12-19', views: 1847 },
    { date: '2025-12-20', views: 2103 },
    { date: '2025-12-21', views: 1782 },
    { date: '2025-12-22', views: 1921 },
    { date: '2025-12-23', views: 2156 },
    { date: '2025-12-24', views: 1121 },
  ],
  '30d': [
    { date: '2025-11-25', views: 1234 },
    { date: '2025-11-26', views: 1456 },
    { date: '2025-11-27', views: 1678 },
    { date: '2025-11-28', views: 1234 },
    { date: '2025-11-29', views: 1567 },
    { date: '2025-11-30', views: 1890 },
    { date: '2025-12-01', views: 2134 },
    { date: '2025-12-02', views: 1876 },
    { date: '2025-12-03', views: 1543 },
    { date: '2025-12-04', views: 1234 },
    { date: '2025-12-05', views: 1456 },
    { date: '2025-12-06', views: 1678 },
    { date: '2025-12-07', views: 1890 },
    { date: '2025-12-08', views: 2123 },
    { date: '2025-12-09', views: 1876 },
    { date: '2025-12-10', views: 1543 },
    { date: '2025-12-11', views: 1234 },
    { date: '2025-12-12', views: 1456 },
    { date: '2025-12-13', views: 1678 },
    { date: '2025-12-14', views: 1890 },
    { date: '2025-12-15', views: 2123 },
    { date: '2025-12-16', views: 1876 },
    { date: '2025-12-17', views: 1543 },
    { date: '2025-12-18', views: 1523 },
    { date: '2025-12-19', views: 1847 },
    { date: '2025-12-20', views: 2103 },
    { date: '2025-12-21', views: 1782 },
    { date: '2025-12-22', views: 1921 },
    { date: '2025-12-23', views: 2156 },
    { date: '2025-12-24', views: 1121 },
  ],
}

export const mockTopPages: Record<TimeRange, TopPage[]> = {
  '7d': [
    { path: '/keyboard-trends-in-2026', views: 4521 },
    { path: '/split-keyboards-revolutionizing-ergonomics-in-2026', views: 3214 },
    { path: '/top-7-cool-accessories-to-enhance-your-setup-in-2026', views: 2876 },
    { path: '/', views: 1234 },
    { path: '/about', views: 608 },
  ],
  '30d': [
    { path: '/keyboard-trends-in-2026', views: 18234 },
    { path: '/split-keyboards-revolutionizing-ergonomics-in-2026', views: 12453 },
    { path: '/top-7-cool-accessories-to-enhance-your-setup-in-2026', views: 9876 },
    { path: '/', views: 5432 },
    { path: '/about', views: 2797 },
  ],
}

export const mockReferrers: Record<TimeRange, Referrer[]> = {
  '7d': [
    { source: 'Direct', count: 4521 },
    { source: 'Google', count: 3214 },
    { source: 'Twitter / X', count: 2876 },
    { source: 'Reddit', count: 1234 },
    { source: 'LinkedIn', count: 608 },
  ],
  '30d': [
    { source: 'Direct', count: 18234 },
    { source: 'Google', count: 12453 },
    { source: 'Twitter / X', count: 9876 },
    { source: 'Reddit', count: 5432 },
    { source: 'LinkedIn', count: 2797 },
  ],
}
