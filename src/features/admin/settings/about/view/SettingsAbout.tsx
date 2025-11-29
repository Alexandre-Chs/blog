import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ClientOnly, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { MarkdownPlugin } from '@platejs/markdown'
import { settingsAboutList, settingsAboutUpdate } from '../api/list'
import type { PlateEditor } from 'platejs/react'
import Editor from '@/features/editor/Editor'
import { Button } from '@/components/ui/button'
import NavigationName from '@/components/ui/navigation-name'

export default function SettingsAboutPage() {
  const editorRef = useRef<PlateEditor>(null)
  const navigate = useNavigate()
  const settingsAboutFn = useServerFn(settingsAboutList)
  const settingsAboutUpdateFn = useServerFn(settingsAboutUpdate)

  const { data: aboutContent, isPending } = useQuery({
    queryKey: ['settingsAbout'],
    queryFn: () => settingsAboutFn(),
  })

  const updateSettingsAboutMutation = useMutation({
    mutationFn: settingsAboutUpdateFn,
    onSuccess: () => {
      toast.success('About edited successfully!')
      navigate({ to: '/admin' })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while updating the about page.')
      }
    },
  })

  useEffect(() => {
    if (aboutContent && editorRef.current) {
      const plateValue = editorRef.current.getApi(MarkdownPlugin).markdown.deserialize(aboutContent.value.content)
      editorRef.current.tf.setValue(plateValue)
    }
  }, [aboutContent])

  if (isPending) {
    return <div>Loading about...</div>
  }

  const handleEditArticle = () => {
    if (!editorRef.current) {
      toast.error('Editor initialization failed. Please refresh the page.')
      return
    }

    const markdown = editorRef.current.getApi(MarkdownPlugin).markdown.serialize()
    if (!markdown || markdown.trim() === '') {
      toast.error('Content is required.')
      return
    }

    updateSettingsAboutMutation.mutate({
      data: {
        content: markdown,
      },
    })
  }

  return (
    <>
      <NavigationName name="About Page" subtitle="Manage the text shown on the About page in your blog's footer" />
      <ClientOnly fallback={<div>Loading editor...</div>}>
        <div className="flex justify-end items-center p-4">
          <Button
            disabled={updateSettingsAboutMutation.isPending}
            onClick={handleEditArticle}
            className="cursor-pointer"
          >
            {updateSettingsAboutMutation.isPending ? 'Updating...' : 'Update about'}
          </Button>
        </div>
        <div className="px-4">
          <div className="max-w-5xl mx-auto">
            <Editor ref={editorRef} placeholder="Write about page here..." />
          </div>
        </div>
      </ClientOnly>
    </>
  )
}
