import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { thumbnailInsertDatabase, thumbnailSignedUrl } from '../api/thumbnail'
import { Input } from '@/components/ui/input'

type UploadThumbnailProps = {
  articleId: string
}

export default function UploadThumbnail({ articleId }: UploadThumbnailProps) {
  const thumbnailSignedUrlFn = useServerFn(thumbnailSignedUrl)
  const thumbnailInsertDatabaseFn = useServerFn(thumbnailInsertDatabase)

  const handleUploadThumbnail = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (!file) return

    try {
      const { presigned, key } = await thumbnailSignedUrlFn({
        data: { contentType: file.type || 'application/octet-stream', size: file.size },
      })

      const res = await fetch(presigned, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!res.ok) {
        toast.error('Upload failed with status ' + res.status)
        return
      }

      await thumbnailInsertDatabaseFn({
        data: { articleId, key, mimetype: file.type, size: file.size },
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred during the upload.')
      }
    }
  }
  return <Input id="picture" type="file" onChange={handleUploadThumbnail} />
}
