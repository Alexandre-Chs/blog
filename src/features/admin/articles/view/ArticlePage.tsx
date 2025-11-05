type ArticlePageProps = {
  slug: string
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  return <div>Article Page for {slug}</div>
}
