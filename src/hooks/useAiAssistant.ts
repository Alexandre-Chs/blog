import { useServerFn } from '@tanstack/react-start'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import type { SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor'
import { generateArticle } from '@/lib/openrouter/api'

export function useAiAssistant(editorRef: React.RefObject<SimpleEditorRef | null>, setTitle: (title: string) => void) {
  const [aiSheetOpen, setAiSheetOpen] = useState(false)
  const [aiSubject, setAiSubject] = useState('')
  const [aiAdditionalInfo, setAiAdditionalInfo] = useState('')

  const generateArticleFn = useServerFn(generateArticle)

  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingText, setStreamingText] = useState('')

  const handleGenerateArticle = useCallback(async () => {
    setIsGenerating(true)
    setStreamingText('')

    let finalTitle = ''
    let finalContent = ''
    let chunkCount = 0
    let lastUpdate = Date.now()

    try {
      for await (const msg of await generateArticleFn({
        data: { subject: aiSubject, additionalInfo: aiAdditionalInfo },
      })) {
        finalTitle = msg.title
        finalContent = msg.content

        chunkCount++

        const now = Date.now()
        if (chunkCount % 15 === 0 && now - lastUpdate > 800) {
          const lines = msg.content.split('\n').filter((line) => line.trim())
          if (lines.length > 0) {
            const randomLine = lines[Math.floor(Math.random() * lines.length)]
            setStreamingText(randomLine.slice(0, 100))
            lastUpdate = now
          }
        }

        if (msg.isComplete) {
          if (!editorRef.current) {
            toast.error('Editor not ready')
            setIsGenerating(false)
            return
          }

          editorRef.current.setMarkdown(finalContent)
          setTitle(finalTitle)

          toast.success('Article generated successfully!')
          setAiSheetOpen(false)
          setIsGenerating(false)
          setStreamingText('')
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate article')
      setIsGenerating(false)
      setStreamingText('')
    }
  }, [aiSubject, aiAdditionalInfo, generateArticleFn])

  return {
    aiSheetOpen,
    setAiSheetOpen,
    aiSubject,
    setAiSubject,
    aiAdditionalInfo,
    setAiAdditionalInfo,
    handleGenerateArticle,
    isGenerating,
    streamingText,
  }
}
