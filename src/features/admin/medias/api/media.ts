import z from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '@/lib/s3'
import { adminMiddleware } from '@/middlewares/admin'

const maxThumbnailSizeBytes = 5 * 1024 * 1024 // 5MB
const allowedContentTypesMedias = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const allowedContentTypesFavicons = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/svg+xml']

const mediaSignedSchema = z.object({
  contentType: z.string(),
  size: z.number().nonnegative(),
  type: z.enum(['media', 'favicon']).default('media'),
})

export const mediaSignedUrl = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .inputValidator(mediaSignedSchema)
  .handler(async ({ data }) => {
    if (!process.env.S3_BUCKET_NAME) throw new Error('S3_BUCKET_NAME is not configured')

    if (data.type === 'favicon') {
      if (!allowedContentTypesFavicons.includes(data.contentType)) throw new Error('File type not allowed for favicon')
    } else {
      if (!allowedContentTypesMedias.includes(data.contentType)) throw new Error('File type not allowed')
    }

    if (data.size > maxThumbnailSizeBytes) {
      throw new Error('File is too large (max 5MB)')
    }

    const extension = data.contentType.split('/')[1] ?? 'jpg'

    const folder = process.env.S3_FOLDER_NAME || 'blog'
    const key = `${folder}/${crypto.randomUUID()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: data.contentType,
      ACL: 'public-read',
    })

    const presigned = await getSignedUrl(s3Client as any, command, {
      expiresIn: 5 * 60,
      signableHeaders: new Set(['content-type']),
    })

    const publicBase = process.env.S3_PUBLIC_BASE_URL
    const bucketName = process.env.S3_BUCKET_NAME

    const fileUrl = `${publicBase}/${bucketName}/${key}`

    return {
      presigned,
      fileUrl,
      key,
      expiresIn: 300,
    }
  })
