import { Link } from '@tanstack/react-router'
import type { Article } from '@/db/schema'
import { PlateMarkdown } from '@/components/PlateMarkdown'
import { formatDate } from '@/utils/formatDate'

type ArticleContent = Article & {
  variant: 'article'
  authorName?: string | null
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
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-20">
        {content.variant === 'article' ? (
          <ArticleContentView content={content} />
        ) : (
          <PageContentView content={content} />
        )}

        <div className="mt-12 text-sm">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900 hover:underline">
            ← Back
          </Link>
        </div>
      </main>
    </div>
  )
}

function ArticleContentView({ content }: { content: ArticleContent }) {
  const authorName = content.authorName ?? 'Editorial team'
  const primaryDate = formatDate(content.publishedAt)

  return (
    <article className="space-y-6">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{primaryDate}</p>

      <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">{content.title}</h1>

      <div className="flex flex-col gap-2 text-sm text-neutral-500 sm:flex-row sm:items-center sm:gap-3">
        <span className="font-medium text-neutral-600">{authorName}</span>
      </div>

      <div className="pt-6 text-neutral-800">
        <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
          {content.content}
        </PlateMarkdown>
      </div>
    </article>
  )
}

function PageContentView({ content }: { content: StaticContent }) {
  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">{content.title}</h1>

      <div className="pt-6 text-neutral-800">
        <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
          {content.content}
        </PlateMarkdown>
      </div>
    </article>
  )
}
