import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { auth } from '@/lib/auth/auth'

const articleCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

export const articleCreate = createServerFn({ method: 'POST' })
  .inputValidator(articleCreateSchema)
  .handler(async ({ data }) => {
    try {
      const sessionUser = await auth.api.getSession({
        headers: getRequestHeaders(),
      })

      if (!sessionUser?.user) throw new Error('Unauthorized')

      const [article] = await db
        .insert(articles)
        .values({
          id: crypto.randomUUID(),
          title: data.title,
          content: data.content,
          status: 'published',
          authorId: sessionUser.user.id,
          slug: data.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
        })
        .returning()

      return { success: true, article }
    } catch (err) {
      throw new Error('Failed to create article', err as any)
    }
  })
