import { betterAuth } from 'better-auth'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
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
      },
    },
  },
})
