import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ClientOnly, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { settingsAboutUpdate } from './settings-about-update.api'
import type { SimpleEditorRef } from '@/components/tiptap-templates/simple/simple-editor'
import { Editor } from '@/components/tiptap-templates/simple/simple-editor'
import { Button } from '@/components/ui/button'
import NavigationName from '@/components/ui/navigation-name'
import { settingsAboutRead } from './settings-about-read.api'

export default function SettingsAboutPage() {
  const editorRef = useRef<SimpleEditorRef>(null)
  const navigate = useNavigate()
  const settingsAboutReadFn = useServerFn(settingsAboutRead)
  const settingsAboutUpdateFn = useServerFn(settingsAboutUpdate)

  const { data: aboutContent, isPending } = useQuery({
    queryKey: ['settingsAbout'],
    queryFn: () => settingsAboutReadFn(),
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
    if (aboutContent && editorRef.current && aboutContent.value.content) {
      editorRef.current.setMarkdown(aboutContent.value.content)
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

    const markdown = editorRef.current.getMarkdown()
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
        <div className="flex max-w-5xl mx-auto justify-end items-center pb-4 w-full">
          <Button
            disabled={updateSettingsAboutMutation.isPending}
            onClick={handleEditArticle}
            className="cursor-pointer"
          >
            {updateSettingsAboutMutation.isPending ? 'Updating...' : 'Update about'}
          </Button>
        </div>
        <div className="max-w-5xl mx-auto pt-6 bg-sidebar rounded-xl p-6 border border-sidebar-border w-full">
          <div className="w-full">
            <Editor ref={editorRef} initialContent={aboutContent?.value.content || 'Type here...'} />
          </div>
        </div>
      </ClientOnly>
    </>
  )
}
