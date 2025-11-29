import { ClientOnly, useNavigate } from '@tanstack/react-router'
import ArticleThumbnail from '../../medias/components/ArticleThumbnail'
import UploadThumbnail from '../../medias/components/UploadThumbnail'
import Editor from '@/features/editor/Editor'
import { Button } from '@/components/ui/button'
import { useArticleEditPage } from '@/hooks/useArticleEdit'

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
    isPublishing,
  } = useArticleEditPage(articleId)

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

  return (
    <ClientOnly fallback={<div>Loading editor...</div>}>
      <div className="flex justify-end items-center p-4">
        <Button disabled={isPublishing} onClick={handleEditArticle} className="cursor-pointer">
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <div className="px-4">
        <div className="max-w-5xl mx-auto pb-4 pl-4">
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
  )
}
