import { useRef, useState } from 'react'
import { ClientOnly, useNavigate } from '@tanstack/react-router'
import { MarkdownPlugin } from '@platejs/markdown'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { articleCreate } from '../api/create'
import UploadThumbnail from '../../medias/components/UploadThumbnail'
import type { PlateEditor } from 'platejs/react'
import Editor from '@/features/editor/Editor'
import { Button } from '@/components/ui/button'

export default function ArticlesCreatePage() {
  const [title, setTitle] = useState<string>('')
  const editorRef = useRef<PlateEditor>(null)
  const createArticleFn = useServerFn(articleCreate)
  const articleId = crypto.randomUUID()

  const navigate = useNavigate()

  const handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value)
  }

  const createArticleMutation = useMutation({
    mutationFn: createArticleFn,
    onSuccess: () => {
      toast.success('Article published successfully!')
      navigate({ to: '/admin/articles' })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while publishing the article.')
      }
    },
  })

  const handlePublish = () => {
    if (!editorRef.current) {
      toast.error('Editor initialization failed. Please refresh the page.')
      return
    }

    if (!title.trim()) {
      toast.error('Title is required.')
      return
    }

    const markdown = editorRef.current.getApi(MarkdownPlugin).markdown.serialize()
    if (!markdown || markdown.trim() === '') {
      toast.error('Content is required.')
      return
    }

    createArticleMutation.mutate({
      data: {
        articleId,
        title: title.trim(),
        content: markdown,
      },
    })
  }

  return (
    <ClientOnly fallback={<div>Loading editor...</div>}>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-x-2">
          <div>Date</div>
        </div>
        <Button disabled={createArticleMutation.isPending} onClick={handlePublish}>
          {createArticleMutation.isPending ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <UploadThumbnail articleId={articleId} />

      <div className="px-4">
        <div className="max-w-5xl mx-auto pb-4 pl-4">
          <input
            value={title}
            onChange={handleTitleChange}
            type="text"
            placeholder="Title"
            className="outline-none bg-transparent text-2xl w-full"
          />
        </div>
        <div className="max-w-5xl mx-auto">
          <Editor ref={editorRef} />
        </div>
      </div>
    </ClientOnly>
  )
}
