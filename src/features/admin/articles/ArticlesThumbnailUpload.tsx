import { useMutation, useQueryClient  } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { UploadCloud } from 'lucide-react'
import { s3SignedUrlCreate } from '../../../lib/s3-signed-url-create.api'
import { ArticlesGalleryModal } from './ArticlesGalleryModal'
import { articlesArticleThumbnailCreate } from './articles-article-thumbnail-create.api'
import { articlesArticleThumbnailsGallery } from './articles-article-thumbnail-update.api'
import type { GalleryImage } from '../settings/gallery/settings-gallery.types'
import { Input } from '@/components/ui/input'

type UploadThumbnailProps = {
  articleId: string
}

export default function ArticlesThumbnailUpload({ articleId }: UploadThumbnailProps) {
  const mediaSignedUrlFn = useServerFn(s3SignedUrlCreate)
  const thumbnailInsertDatabaseFn = useServerFn(articlesArticleThumbnailCreate)
  const thumbnailFromGalleryFn = useServerFn(articlesArticleThumbnailsGallery)
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { presigned, key } = await mediaSignedUrlFn({
        data: { contentType: file.type || 'application/octet-stream', size: file.size },
      })

      const res = await fetch(presigned, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!res.ok) throw new Error('Upload failed with status ' + res.status)

      await thumbnailInsertDatabaseFn({
        data: { articleId, key, mimetype: file.type, size: file.size },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
      toast.success('Thumbnail uploaded successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const galleryMutation = useMutation({
    mutationFn: async (key: string) => {
      await thumbnailFromGalleryFn({ data: { articleId, key } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleEdit'] })
      toast.success('Thumbnail selected successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleUploadThumbnail = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file) uploadMutation.mutate(file)
  }

  const handleSelectGalleryImage = (image: GalleryImage) => {
    galleryMutation.mutate(image.key)
  }

  return (
    <>
      <label
        htmlFor="thumbnail-upload"
        className="h-[300px] group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/10 px-4 py-6 text-center transition hover:border-gray-200 hover:bg-gray-50"
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

        <div className="my-4 flex items-center justify-center">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px w-12 bg-gray-500" />
            <span className="text-gray-500">or</span>
            <span className="h-px w-12 bg-gray-500" />
          </div>
        </div>

        <ArticlesGalleryModal onSelect={handleSelectGalleryImage} buttonText="Select from Gallery" />
      </label>
    </>
  )
}
