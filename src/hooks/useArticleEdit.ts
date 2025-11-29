import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MarkdownPlugin } from '@platejs/markdown'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import type { PlateEditor } from 'platejs/react'
import { articleById, articleUpdate } from '@/features/admin/articles/api/edit'
import { thumbnailUpdateAlt } from '@/features/admin/medias/api/thumbnail'

export function useArticleEditPage(articleId: string) {
  const editorRef = useRef<PlateEditor>(null)
  const [title, setTitle] = useState('')
  const [thumbnailAlt, setThumbnailAlt] = useState('')
  const articleByIdFn = useServerFn(articleById)
  const articleUpdateFn = useServerFn(articleUpdate)
  const thumbnailUpdateAltFn = useServerFn(thumbnailUpdateAlt)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: articleData, isPending } = useQuery({
    queryKey: ['articleEdit', articleId],
    queryFn: () => articleByIdFn({ data: { articleId } }),
  })

  useEffect(() => {
    if (!articleData || !editorRef.current) return
    const plateValue = editorRef.current.getApi(MarkdownPlugin).markdown.deserialize(articleData.article.content)
    editorRef.current.tf.setValue(plateValue)
    setTitle(articleData.article.title)
    setThumbnailAlt(articleData.thumbnail?.alt ?? '')
  }, [articleData])

  const updateArticleMutation = useMutation({
    mutationFn: articleUpdateFn,
    onSuccess: () => {
      toast.success('Article edited successfully!')
      navigate({ to: '/admin/articles' })
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('An error occurred while updating the article.')
    },
  })

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
        publishedAt: new Date(),
      },
    })
  }

  const handleThumbnailAltBlur = async () => {
    const altNew = thumbnailAlt.trim()
    try {
      await thumbnailUpdateAltFn({ data: { articleId, alt: altNew } })
      queryClient.invalidateQueries({ queryKey: ['articleEdit', articleId] })
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error('An unknown error occurred while updating the alt text.')
    }
  }

  return {
    editorRef,
    articleData,
    isPending,
    title,
    setTitle,
    thumbnailAlt,
    setThumbnailAlt,
    handleEditArticle,
    handleThumbnailAltBlur,
    isPublishing: updateArticleMutation.isPending,
  }
}
