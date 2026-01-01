import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { ImageIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { settingsGalleryDelete } from './settings-gallery-delete.api'
import { settingsGalleryRead } from './settings-gallery-read.api'
import type { GalleryImage } from './settings-gallery.types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import NavigationName from '@/components/ui/navigation-name'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ImageCardProps = {
  image: GalleryImage
  onDelete: () => void
  deletingKey: string | null
}

function ImageCard({ image, onDelete, deletingKey }: ImageCardProps) {
  const [imageError, setImageError] = useState(false)
  const isDeleting = deletingKey === image.key

  return (
    <div className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
      {imageError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <p className="text-xs text-gray-500 mt-2">Failed to load</p>
        </div>
      ) : (
        <img
          src={image.url}
          alt={`Gallery image ${image.key}`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/20 hover:text-white hover:scale-110 transition-all duration-200"
              disabled={isDeleting}
            >
              <Trash2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete image</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The image will be permanently deleted from S3.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs truncate">{(image.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  )
}

export default function SettingsGalleryPage() {
  const [deletingKey, setDeletingKey] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const settingsGalleryReadFn = useServerFn(settingsGalleryRead)
  const settingsGalleryDeleteFn = useServerFn(settingsGalleryDelete)

  const {
    data: images,
    isPending,
    error,
  } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => settingsGalleryReadFn(),
  })

  const deleteMutation = useMutation({
    mutationFn: settingsGalleryDeleteFn,
    onMutate: ({ data: { key } }) => {
      setDeletingKey(key)
    },
    onSettled: () => {
      setDeletingKey(null)
    },
    onSuccess: () => {
      toast.success('Image deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An error occurred while deleting the image.')
      }
    },
  })

  if (isPending) {
    return (
      <>
        <NavigationName name="Gallery" subtitle="Manage your S3 images" />
        <div className="flex flex-col gap-2 max-w-5xl mx-auto pt-6 w-full px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavigationName name="Gallery" subtitle="Manage your S3 images" />
        <div className="flex flex-col gap-2 max-w-5xl mx-auto pt-6 w-full px-4">
          <div className="text-center py-12">
            <p className="text-red-600">
              Error loading images: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </>
    )
  }

  if (images.length === 0) {
    return (
      <>
        <NavigationName name="Gallery" subtitle="Manage your S3 images" />
        <div className="flex flex-col gap-2 max-w-5xl mx-auto w-full h-full">
          <div className="flex items-center justify-center flex-col text-center h-full">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">Your S3 bucket is empty. Upload images to see them here.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavigationName name="Gallery" subtitle="Manage your S3 images" />
      <div className="flex flex-col gap-2 max-w-5xl mx-auto pt-6 w-full px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageCard
              key={image.key}
              image={image}
              onDelete={() => deleteMutation.mutate({ data: { key: image.key } })}
              deletingKey={deletingKey}
            />
          ))}
        </div>
      </div>
    </>
  )
}
