import { Cron, scheduledJobs } from 'croner'
import { SESSION_TIMEOUT, activeSessions, saveSessionDatabase } from './analytics-session'

function generateRandomSalt() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

let currentSalt: string = generateRandomSalt()
let previousSalt: string = currentSalt

export function getCurrentSalts() {
  return {
    currentSalt: currentSalt,
    previousSalt: previousSalt,
  }
}

function analyticsCron() {
  const saltJob = scheduledJobs.find((j) => j.name === 'analytics-salt')
  if (saltJob) saltJob.stop() // for hot-reloading scenarios

  const sessionJob = scheduledJobs.find((j) => j.name === 'analytics-session')
  if (sessionJob) sessionJob.stop()

  new Cron('*/5 * * * *', { name: 'analytics-session' }, () => {
    console.log('CRON analytics', new Date().toISOString())
    if (!activeSessions.size) return

    const now = Date.now()
    const sessions = activeSessions.entries()

    for (const [hash, session] of sessions) {
      const inactiveSession = now - session.lastSeenAt.getTime()
      if (inactiveSession > SESSION_TIMEOUT) {
        saveSessionDatabase(session)
        activeSessions.delete(hash)
      }
    }
  })

  new Cron('* * * * * *', { name: 'analytics-salt', interval: 90 }, () => {
    previousSalt = currentSalt!
    currentSalt = generateRandomSalt()
  })

  console.log('Crons initialized')
}

export { analyticsCron }
