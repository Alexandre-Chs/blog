import { ClientOnly, useNavigate } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'
import ArticleThumbnail from '../../medias/components/ArticleThumbnail'
import UploadThumbnail from '../../medias/components/UploadThumbnail'
import Editor from '@/features/editor/Editor'
import { Button } from '@/components/ui/button'
import { useArticleEditPage } from '@/hooks/useArticleEdit'
import { DatePicker } from '@/components/datepicker/DatePicker'
import NavigationName from '@/components/ui/navigation-name'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAiAssistant } from '@/hooks/useAiAssistant'
import { AiLoader } from '@/components/ui/ai-loader'

type ArticleEditPageProps = {
  articleId: string
}

export default function ArticleEditPage({ articleId }: ArticleEditPageProps) {
  const {
    editorRef,
    articleData,
    isPending,
    title,
    setTitle,
    thumbnailAlt,
    setThumbnailAlt,
    handleEditArticle,
    handleThumbnailAltBlur,
    handleDeletePublishedAt,
    isPublishing,
    setPublishedAt,
    publishedAt,
  } = useArticleEditPage(articleId)

  const {
    aiSheetOpen,
    setAiSheetOpen,
    aiSubject,
    setAiSubject,
    aiAdditionalInfo,
    setAiAdditionalInfo,
    handleGenerateArticle,
    isGenerating,
    streamingText,
  } = useAiAssistant(editorRef, setTitle)

  const navigate = useNavigate()

  if (isPending) {
    return <div>Loading article...</div>
  }

  if (!articleData?.article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl text-gray-700">Article not found</div>
        <Button onClick={() => navigate({ to: '/admin/articles' })}>Go back to articles</Button>
      </div>
    )
  }

  const subtitle = articleData.article.title ? `Editing: ${articleData.article.title}` : 'Start writing your article'

  return (
    <>
      <NavigationName name="Write your article" subtitle={subtitle} />
      <ClientOnly fallback={<div>Loading editor...</div>}>
        <div className="px-4">
          <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
            <div className="flex gap-x-2">
              <DatePicker onChange={setPublishedAt} value={publishedAt} placeholder="Pick a publish date" />
              {publishedAt && (
                <Button variant="secondary" onClick={handleDeletePublishedAt}>
                  Unpublish
                </Button>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <Sheet open={aiSheetOpen} onOpenChange={setAiSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>AI Writing Assistant</SheetTitle>
                    <SheetDescription>
                      Let AI help you write your article. Provide a subject and any additional details.
                    </SheetDescription>
                  </SheetHeader>
                  {isGenerating ? (
                    <AiLoader streamingText={streamingText} className="px-4" />
                  ) : (
                    <div className="space-y-6 py-6 px-4">
                      <div className="space-y-2">
                        <Label htmlFor="ai-subject">Article Subject *</Label>
                        <Input
                          id="ai-subject"
                          placeholder="e.g., The future of web development"
                          value={aiSubject}
                          onChange={(e) => setAiSubject(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ai-additional">Additional Information</Label>
                        <Textarea
                          id="ai-additional"
                          placeholder="Add any specific points, tone, or context you'd like the AI to consider..."
                          className="min-h-[150px]"
                          value={aiAdditionalInfo}
                          onChange={(e) => setAiAdditionalInfo(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleGenerateArticle}
                        disabled={!aiSubject.trim()}
                        className="w-full gap-2 cursor-pointer"
                      >
                        Generate
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              <Button disabled={isPublishing} onClick={handleEditArticle} className="cursor-pointer">
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
          <div className="max-w-5xl mx-auto pb-4">
            <div className="py-4">
              {articleData.thumbnail ? (
                <ArticleThumbnail
                  thumbnailUrl={articleData.thumbnail.url}
                  articleId={articleId}
                  alt={thumbnailAlt}
                  onAltChange={setThumbnailAlt}
                  onAltBlur={handleThumbnailAltBlur}
                />
              ) : (
                <UploadThumbnail articleId={articleId} />
              )}
            </div>

            <div className="max-w-5xl mx-auto pt-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
                className="outline-none bg-transparent text-2xl w-full"
              />
              <Editor ref={editorRef} />
            </div>
          </div>
        </div>
      </ClientOnly>
    </>
  )
}
