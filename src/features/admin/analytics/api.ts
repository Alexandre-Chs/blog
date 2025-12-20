import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import z from 'zod'
import { createSession, findActiveSession, updateSession } from './session-manager'
import { getVisitorHashes } from './hash'
import { cronAnalytics } from './cron'
import type { Device } from '@/db/schema'

const trackPageViewSchema = z.object({
  path: z.string(),
})

function deviceType(userAgent: string): Device {
  const ua = userAgent.toLowerCase()

  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  if (/tablet|ipad|playbook|silk|kindle/i.test(ua)) return 'tablet'

  return 'desktop'
}

export const trackPageView = createServerFn({ method: 'POST' })
  .inputValidator(trackPageViewSchema)
  .handler((data) => {
    const request = getRequest()

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'unknown'
    const path = data.data.path || 'unknown'

    // cronAnalytics()

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
