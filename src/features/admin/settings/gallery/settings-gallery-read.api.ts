import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { medias } from '@/db/schema'

export const settingsGalleryRead = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const mediasAll = await db.select().from(medias).orderBy(desc(medias.createdAt))
    const publicBase = process.env.S3_PUBLIC_BASE_URL

    return mediasAll.map((media) => ({
      key: media.key,
      url: `${publicBase}${media.key}`,
      size: media.size,
      lastModified: media.createdAt,
    }))
  })
