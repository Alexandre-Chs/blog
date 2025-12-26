import crypto from 'node:crypto'
import { getCurrentSalts } from './analytics-cron'

export function calculateHash(ip: string, userAgent: string, salt: string) {
  const data = `${ip}|${userAgent}|${salt}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function getVisitorHashes(ip: string, userAgent: string) {
  const { currentSalt, previousSalt } = getCurrentSalts()

  return {
    currentHash: calculateHash(ip, userAgent, currentSalt),
    previousHash: calculateHash(ip, userAgent, previousSalt),
  }
}
