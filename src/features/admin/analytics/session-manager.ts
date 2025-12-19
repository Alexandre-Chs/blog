import type { Device } from '@/db/schema'
import { visits } from '@/db/schema'
import { db } from '@/index'

type Session = {
  id: string
  hash: string
  startedAt: Date
  lastSeenAt: Date
  pages: Array<string>
  pageViews: number
  entryPage: string
  exitPage: string
  device: Device
  referrer?: string
  country?: string
  browser?: string
}

export const activeSessions = new Map<string, Session>()
export const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

function generateSessionId() {
  return crypto.randomUUID()
}

export function findActiveSession(currentHash: string, previousHash: string): Session | null {
  let session = activeSessions.get(currentHash)
  if (session) return session

  // find with previous hash (salt rotation)
  session = activeSessions.get(previousHash)
  if (session) {
    activeSessions.delete(previousHash)
    session.hash = currentHash
    activeSessions.set(currentHash, session)
    return session
  }

  return null
}

export function createSession(hash: string, path: string, device: Device, referrer?: string): Session {
  const session: Session = {
    id: generateSessionId(),
    hash,
    startedAt: new Date(),
    lastSeenAt: new Date(),
    pages: [path],
    pageViews: 1,
    entryPage: path,
    exitPage: path,
    device,
    referrer,
  }

  activeSessions.set(hash, session)
  return session
}

export function updateSession(session: Session, path: string) {
  const now = new Date()
  const timeSinceLastSeen = now.getTime() - session.lastSeenAt.getTime()

  if (timeSinceLastSeen > SESSION_TIMEOUT) {
    saveSessionDatabase(session)
    activeSessions.delete(session.hash)
    return null
  }

  session.lastSeenAt = now
  session.pageViews += 1
  session.pages.push(path)
  session.exitPage = path

  return session
}

export async function saveSessionDatabase(session: Session) {
  try {
    await db.insert(visits).values({
      id: session.id,
      startedAt: session.startedAt,
      lastSeenAt: session.lastSeenAt,
      pages: session.pages,
      pageViews: session.pageViews,
      entryPage: session.entryPage,
      exitPage: session.exitPage,
      referrer: session.referrer,
      country: session.country,
      browser: session.browser,
      device: session.device,
      duration: session.lastSeenAt.getTime() - session.startedAt.getTime(),
    })
  } catch (error) {
    console.error('Error saving session to database:', error, session)
  }
}
