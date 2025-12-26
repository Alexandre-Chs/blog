import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'

import type { SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor'
import { articlesArticleUpdate } from '@/features/admin/articles/articles-article-update.api'
import { thumbnailUpdateAlt } from '@/features/admin/medias/api/thumbnail'
import { articlesArticleRead } from './articles-article-read.api'
import { articlesArticleUnpublish } from './articles-article-unpublish.api'

export function useArticleEdit(articleId: string) {
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined)
  const editorRef = useRef<SimpleEditorRef>(null)
  const [title, setTitle] = useState('')
  const [thumbnailAlt, setThumbnailAlt] = useState('')

  const articlesArticleReadFn = useServerFn(articlesArticleRead)
  const articleUpdateFn = useServerFn(articlesArticleUpdate)
  const thumbnailUpdateAltFn = useServerFn(thumbnailUpdateAlt)
  const articlesArticleUnpublishFn = useServerFn(articlesArticleUnpublish)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: articleData, isPending } = useQuery({
    queryKey: ['articleEdit', articleId],
    queryFn: () => articlesArticleReadFn({ data: { articleId } }),
  })

  useEffect(() => {
    if (!articleData || !editorRef.current) return
    editorRef.current.setMarkdown(articleData.article.content)
    setTitle(articleData.article.title)
    setThumbnailAlt(articleData.thumbnail?.alt ?? '')
    setPublishedAt(articleData.article.publishedAt ? new Date(articleData.article.publishedAt) : undefined)
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

  const handlePublishArticle = () => {
    if (!editorRef.current) {
      toast.error('Editor initialization failed. Please refresh the page.')
      return
    }
    if (!title.trim()) {
      toast.error('Title is required.')
      return
    }
    const markdown = editorRef.current.getMarkdown()
    if (!markdown || markdown.trim() === '') {
      toast.error('Content is required.')
      return
    }

    updateArticleMutation.mutate({
      data: {
        articleId,
        title: title.trim(),
        content: markdown,
        publishedAt: publishedAt ?? new Date(),
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

  const handleDeletePublishedAt = async () => {
    await articlesArticleUnpublishFn({ data: { articleId } })
    queryClient.invalidateQueries({ queryKey: ['articleEdit', articleId] })
  }

  return {
    editorRef,
    articleData,
    isPending,
    title,
    setTitle,
    thumbnailAlt,
    setThumbnailAlt,
    handlePublishArticle,
    handleThumbnailAltBlur,
    handleDeletePublishedAt,
    isPublishing: updateArticleMutation.isPending,
    publishedAt,
    setPublishedAt,
  }
}
