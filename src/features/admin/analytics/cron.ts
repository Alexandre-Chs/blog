import { SESSION_TIMEOUT, activeSessions, saveSessionDatabase } from './session-manager'

// interval to clean up inactive sessions and save to database
setInterval(
  () => {
    if (!Object.keys(activeSessions).length) return

    const now = Date.now()
    const sessions = activeSessions.entries()

    for (const [hash, session] of sessions) {
      const inactiveSession = now - session.lastSeenAt.getTime()
      if (inactiveSession > SESSION_TIMEOUT) {
        saveSessionDatabase(session)
        activeSessions.delete(hash)
      }
    }
  },
  5 * 60 * 1000, // 5 minutes
)
