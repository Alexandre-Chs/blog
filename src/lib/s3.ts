import { S3Client } from '@aws-sdk/client-s3'

if (!process.env.S3_BUCKET_NAME) throw new Error('S3_BUCKET_NAME is not configured')
if (!process.env.S3_PUBLIC_BASE_URL) throw new Error('S3_PUBLIC_BASE_URL is not configured')

export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})
