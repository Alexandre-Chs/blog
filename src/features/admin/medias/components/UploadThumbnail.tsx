import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { UploadCloud } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { thumbnailInsertDatabase } from '../api/thumbnail'
import { mediaSignedUrl } from '../api/media'
import { Input } from '@/components/ui/input'

type UploadThumbnailProps = {
  articleId: string
}

export default function UploadThumbnail({ articleId }: UploadThumbnailProps) {
  const mediaSignedUrlFn = useServerFn(mediaSignedUrl)
  const thumbnailInsertDatabaseFn = useServerFn(thumbnailInsertDatabase)
  const queryClient = useQueryClient()

  const handleUploadThumbnail = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (!file) return

    try {
      const { presigned, key } = await mediaSignedUrlFn({
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

      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred during the upload.')
      }
    }
  }

  return (
    <label
      htmlFor="thumbnail-upload"
      className="h-[300px] group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center transition hover:border-gray-300 hover:bg-gray-100"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border">
        <UploadCloud className="text-gray-500" size={20} />
      </div>
      <p className="mt-4 text-md font-semibold text-gray-700">Click to upload cover image</p>
      <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP or AVIF (max. 5MB)</p>
      <Input
        id="thumbnail-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleUploadThumbnail}
        className="sr-only"
      />
    </label>
  )
}
