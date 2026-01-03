import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { plannerIdeasCron } from './features/admin/planner/planner-cron'
import { analyticsCron } from './features/admin/analytics/analytics-cron'

function startCrons() {
  try {
    analyticsCron()
    plannerIdeasCron()
    console.log('✅ All crons initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize crons:', error)
  }
}

startCrons()

export default createServerEntry({
  fetch(request) {
    return handler.fetch(request)
  },
})
