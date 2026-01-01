import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Image as ImageIcon } from 'lucide-react'
import { settingsGalleryRead } from '../settings/gallery/settings-gallery-read.api'
import type { GalleryImage } from '../settings/gallery/settings-gallery.types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type ArticlesGalleryModal = {
  onSelect: (image: GalleryImage) => void
  buttonText?: string
}

export function ArticlesGalleryModal({ onSelect, buttonText = 'Select from Gallery' }: ArticlesGalleryModal) {
  const [open, setOpen] = useState(false)

  const { data: galleryImages } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => settingsGalleryRead(),
  })

  const handleSelect = (image: GalleryImage) => {
    onSelect(image)
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="cursor-pointer">
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose from Gallery</DialogTitle>
          </DialogHeader>

          {galleryImages && galleryImages.length > 0 ? (
            <div className="grid grid-cols-6 gap-2 max-h-[400px] overflow-y-auto">
              {galleryImages.map((image) => (
                <button
                  key={image.key}
                  onClick={() => handleSelect(image)}
                  className="relative aspect-square overflow-hidden rounded-md border border-gray-200 transition hover:ring-2 hover:ring-gray-400 cursor-pointer"
                >
                  <img src={image.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center text-gray-400">
              <ImageIcon size={32} />
              <p className="mt-2 text-sm">No images in gallery</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
