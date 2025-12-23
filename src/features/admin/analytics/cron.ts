import { Cron } from 'croner'
import { activeSessions, saveSessionDatabase } from './session-manager'
import { SESSION_TIMEOUT } from './session-manager'

let cronInitialized = false

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

function initializeCrons() {
  if (cronInitialized) {
    return
  }

  cronInitialized = true

  new Cron('*/5 * * * *', () => {
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

  new Cron('* * * * * *', { interval: 90 }, () => {
    console.log('changement de salt!')
    previousSalt = currentSalt!
    currentSalt = generateRandomSalt()
  })

  console.log('Crons initialized')
}

initializeCrons()
