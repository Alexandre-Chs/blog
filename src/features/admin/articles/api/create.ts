import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { articles } from '@/db/schema'
import { db } from '@/index'
import { adminMiddleware } from '@/middlewares/admin'

const articleCreateSchema = z.object({
  articleId: z.uuid(),
})

export const articleCreate = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(articleCreateSchema)
  .handler(async ({ data, context }) => {
    const user = context.adminUser

    const [article] = await db
      .insert(articles)
      .values({
        id: data.articleId,
        title: '',
        content: '',
        authorId: user.id,
        slug: `untitled-${data.articleId}`,
        publishedAt: null,
      })
      .returning()

    return { success: true, article }
  })
