import { MarkdownPlugin } from '@platejs/markdown'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { toast } from 'sonner'
import type { PlateEditor } from 'platejs/react'
import { generateArticle } from '@/lib/openrouter/api'

export function useAiAssistant(editorRef: React.RefObject<PlateEditor | null>) {
  const [aiSheetOpen, setAiSheetOpen] = useState(false)
  const [aiSubject, setAiSubject] = useState('')
  const [aiAdditionalInfo, setAiAdditionalInfo] = useState('')

  const generateArticleFn = useServerFn(generateArticle)

  const generateArticleMutation = useMutation({
    mutationFn: generateArticleFn,
    onSuccess: (data) => {
      if (!editorRef.current) {
        toast.error('Editor not ready')
        return
      }

      const plateValue = editorRef.current.getApi(MarkdownPlugin).markdown.deserialize(data.content)
      editorRef.current.tf.setValue(plateValue)

      toast.success('Article generated successfully!')
      setAiSheetOpen(false)
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to generate article')
      }
    },
  })

  const handleGenerateArticle = () => {
    generateArticleMutation.mutate({
      data: {
        subject: aiSubject,
        additionalInfo: aiAdditionalInfo || undefined,
      },
    })
  }

  return {
    aiSheetOpen,
    setAiSheetOpen,
    aiSubject,
    setAiSubject,
    aiAdditionalInfo,
    setAiAdditionalInfo,
    generateArticleMutation,
    handleGenerateArticle,
  }
}
