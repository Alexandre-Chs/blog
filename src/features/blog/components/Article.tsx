import type { Article, Media } from '@/db/schema'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'

type ArticleContent = Article & {
  variant: 'article'
  authorName: string
  thumbnail?: Media & {
    thumbnailUrl?: string | null
  }
}

type StaticContent = {
  variant: 'page'
  title: string
  content: string
}

type ArticleProps = {
  content: ArticleContent | StaticContent
}

export default function Article({ content }: ArticleProps) {
  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="mx-auto w-full max-w-5xl py-6 md:py-12">
        {content.variant === 'article' ? (
          <ArticleContentView content={content} />
        ) : (
          <PageContentView content={content} />
        )}
      </div>
    </div>
  )
}

function ArticleContentView({ content }: { content: ArticleContent }) {
  const primaryDate = formatDate(content.publishedAt)

  return (
    <article className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-gray-50">
        {content.thumbnail?.thumbnailUrl ? (
          <img
            src={content.thumbnail.thumbnailUrl}
            alt={content.thumbnail.alt || ''}
            className="shadow-sm rounded-lg object-cover h-[300px] w-full hover:shadow-md transition-shadow duration-200"
          />
        ) : (
          <div className="h-[300px] w-full bg-gray-50" />
        )}
      </div>

      <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">{content.title}</h1>
      {primaryDate && <p className="mt-2 text-sm text-neutral-500">{primaryDate}</p>}

      <div className="pt-2 text-neutral-800">
        <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
          {content.content}
        </PlateMarkdown>
      </div>
    </article>
  )
}

function PageContentView({ content }: { content: StaticContent }) {
  return (
    <article className="space-y-8">
      <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">{content.title}</h1>

      <div className="pt-2 text-neutral-800">
        <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
          {content.content}
        </PlateMarkdown>
      </div>
    </article>
  )
}
