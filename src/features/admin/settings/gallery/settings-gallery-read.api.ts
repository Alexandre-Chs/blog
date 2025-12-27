import { createServerFn } from '@tanstack/react-start'
import { adminMiddleware } from '@/middlewares/admin'
import { db } from '@/index'
import { medias } from '@/db/schema'
import { desc } from 'drizzle-orm'

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

// export const settingsGalleryRead = createServerFn({ method: 'GET' })
//   .middleware([adminMiddleware])
//   .handler(async () => {
//     try {
//       const folder = process.env.S3_FOLDER_NAME || 'blog'
//       const command = new ListObjectsV2Command({
//         Bucket: process.env.S3_BUCKET_NAME,
//         Prefix: `${folder}/`,
//       })

//       const response = await s3Client.send(command)
//       if (!response.Contents || response.Contents.length === 0) return []

//       const publicBase = process.env.S3_PUBLIC_BASE_URL
//       const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const

//       const images: Array<GalleryImage> = response.Contents.filter(
//         (obj): obj is { Key: string; Size?: number; LastModified?: Date } => {
//           if (!obj.Key) return false
//           const lastDotIndex = obj.Key.lastIndexOf('.')
//           if (lastDotIndex === -1) return false
//           const ext = obj.Key.slice(lastDotIndex + 1).toLowerCase()
//           return ALLOWED_IMAGE_EXTENSIONS.includes(ext as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])
//         },
//       )
//         .map((obj) => ({
//           key: obj.Key,
//           url: `${publicBase}${obj.Key}`,
//           size: obj.Size ?? 0,
//           lastModified: obj.LastModified ?? new Date(),
//         }))
//         .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())

//       return images
//     } catch (error) {
//       console.error('Error listing gallery images:', error)
//       throw error
//     }
//   })
