import { ClientOnly, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MarkdownPlugin } from '@platejs/markdown'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { articleById, articleUpdate } from '../api/edit'
import type { PlateEditor } from 'platejs/react'
import Editor from '@/features/editor/Editor'
import { Button } from '@/components/ui/button'

type ArticleEditPageProps = {
  articleId: string
}

export default function ArticleEditPage({ articleId }: ArticleEditPageProps) {
  const editorRef = useRef<PlateEditor>(null)
  const [title, setTitle] = useState('')
  const articleByIdFn = useServerFn(articleById)
  const articleUpdateFn = useServerFn(articleUpdate)
  const navigate = useNavigate()

  const { data: article, isPending } = useQuery({
    queryKey: ['articleEdit', articleId],
    queryFn: () => articleByIdFn({ data: { articleId } }),
  })

  const updateArticleMutation = useMutation({
    mutationFn: articleUpdateFn,
    onSuccess: () => {
      toast.success('Article edited successfully!')
      navigate({ to: '/admin/articles' })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while updating the article.')
      }
    },
  })

  useEffect(() => {
    if (article && editorRef.current) {
      const plateValue = editorRef.current.getApi(MarkdownPlugin).markdown.deserialize(article.content)
      editorRef.current.tf.setValue(plateValue)
      setTitle(article.title)
    }
  }, [article])

  if (isPending) {
    return <div>Loading article...</div>
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl text-gray-700">Article not found</div>
        <Button onClick={() => navigate({ to: '/admin/articles' })}>Go back to articles</Button>
      </div>
    )
  }

  const handleTitleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value)
  }

  const handleEditArticle = () => {
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

    updateArticleMutation.mutate({
      data: {
        articleId,
        title: title.trim(),
        content: markdown,
      },
    })
  }

  return (
    <ClientOnly fallback={<div>Loading editor...</div>}>
      <div className="flex justify-end items-center p-4">
        <Button disabled={updateArticleMutation.isPending} onClick={handleEditArticle} className="cursor-pointer">
          {updateArticleMutation.isPending ? 'Updating...' : 'Update article'}
        </Button>
      </div>
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
