import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/index'
import * as schema from '@/db/schema'

const trustedOrigins =
  process.env.NODE_ENV === 'production' ? [process.env.BASE_URL!] : ['http://localhost', 'http://127.0.0.1']

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
})
