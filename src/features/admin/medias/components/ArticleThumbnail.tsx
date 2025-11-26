import { RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import {
  thumbnailDeleteDatabase,
  thumbnailInsertDatabase,
  thumbnailSignedUrl,
  thumbnailUpdateAlt,
} from '../api/thumbnail'

type ArticleThumbnailProps = {
  thumbnailUrl: string
  articleId: string
  alt?: string | null
}

export default function ArticleThumbnail({ thumbnailUrl, articleId, alt }: ArticleThumbnailProps) {
  const queryClient = useQueryClient()
  const thumbnailInsertDatabaseFn = useServerFn(thumbnailInsertDatabase)
  const thumbnailSignedUrlFn = useServerFn(thumbnailSignedUrl)
  const thumbnailUpdateAltFn = useServerFn(thumbnailUpdateAlt)

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

      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred during the upload.')
      }
    }
  }

  const handleAltBlur = async (evt: React.FocusEvent<HTMLInputElement>) => {
    console.log('on blur!')
    const altNew = evt.target.value.trim()
    try {
      await thumbnailUpdateAltFn({ data: { articleId, alt: altNew } })
      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred while updating the alt text.')
      }
    }
  }

  const handleDeleteThumbnail = async () => {
    try {
      await thumbnailDeleteDatabase({ data: { articleId } })
      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred during the deletion.')
      }
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="group relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg">
        <img
          src={thumbnailUrl}
          alt="Article thumbnail"
          className="h-full w-full rounded-lg object-cover transition duration-200 group-hover:blur-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition duration-200 group-hover:opacity-100">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100">
            <RefreshCw className="h-4 w-4" />
            <span>Change</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleUploadThumbnail}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={handleDeleteThumbnail}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
      <input
        type="text"
        name="alt-img"
        defaultValue={alt ?? ''}
        onBlur={handleAltBlur}
        placeholder="Describe the image for accessibility (alt text)"
        className="border-b border-gray-100 pb-1 w-full text-gray-700 placeholder:text-gray-400 focus:border-b-gray-300 focus:outline-none"
      />
    </div>
  )
}
