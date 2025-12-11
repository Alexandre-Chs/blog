import { betterAuth } from 'better-auth'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { eq } from 'drizzle-orm'
import { db } from '@/index'
import * as schema from '@/db/schema'

const trustedOrigins =
  process.env.NODE_ENV === 'production' ? [process.env.BASE_URL!] : ['http://localhost:3000', 'http://127.0.0.1']

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  trustedOrigins,
  rateLimit: {
    window: 60,
    max: 10,
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const existing = await db.select().from(schema.user).limit(1)
        if (existing.length > 0) {
          throw new APIError('BAD_REQUEST', {
            message: 'Error signup.',
          })
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const existing = await db.select().from(schema.user).limit(1)
          if (existing.length > 0) {
            throw new APIError('BAD_REQUEST', {
              message: 'Error signup.',
            })
          }
          return { data: { ...user, role: 'admin' } }
        },
        after: async () => {
          const exists = await db.select().from(schema.settings).where(eq(schema.settings.key, 'general')).limit(1)

          if (exists.length === 0) {
            await db.insert(schema.settings).values({
              key: 'general',
              value: { name: 'my blog' },
            })
          }
        },
      },
    },
  },
})
