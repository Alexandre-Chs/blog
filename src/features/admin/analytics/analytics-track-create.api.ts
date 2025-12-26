import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import z from 'zod'
import { createSession, findActiveSession, updateSession } from './analytics-session'
import { getVisitorHashes } from './analytics-hash'
import type { Device } from '@/db/schema'

const analyticsTrackCreateSchema = z.object({
  path: z.string(),
})

function deviceType(userAgent: string): Device {
  const ua = userAgent.toLowerCase()

  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  if (/tablet|ipad|playbook|silk|kindle/i.test(ua)) return 'tablet'

  return 'desktop'
}

export const analyticsTrackCreate = createServerFn({ method: 'POST' })
  .inputValidator(analyticsTrackCreateSchema)
  .handler((data) => {
    const request = getRequest()

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'unknown'
    const path = data.data.path || 'unknown'

    // avoid all admin paths
    if (path.startsWith('/admin')) return true

    const { previousHash, currentHash } = getVisitorHashes(ip, userAgent)

    let session = findActiveSession(currentHash, previousHash)

    if (!session) {
      session = createSession(currentHash, path, deviceType(userAgent), referrer)
    } else {
      const updated = updateSession(session, path)

      if (!updated) session = createSession(currentHash, path, deviceType(userAgent), referrer)
    }

    return true
  })
