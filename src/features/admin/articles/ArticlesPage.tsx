import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import ArticlesArticleList from './ArticlesArticleList'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NavigationName from '@/components/ui/navigation-name'
import { articlesCount } from './articles-read.api'

function ArticlesCount({ count }: { count: number }) {
  return <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">{count}</Badge>
}

export default function ArticlesPage() {
  const articlesCountFn = useServerFn(articlesCount)

  const { data } = useQuery({
    queryKey: ['articlesCount'],
    queryFn: articlesCountFn,
  })

  if (!data) return null

  return (
    <>
      <NavigationName name="Articles" subtitle="View and filter your published, scheduled, and draft articles" />
      <Tabs defaultValue="published" className="max-w-3xl mx-auto w-full">
        <TabsList>
          <TabsTrigger value="published">
            Published
            <ArticlesCount count={data['published']} />
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            <ArticlesCount count={data['scheduled']} />
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts
            <ArticlesCount count={data['draft']} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <ArticlesArticleList articleStatus="published" />
        </TabsContent>
        <TabsContent value="scheduled">
          <ArticlesArticleList articleStatus="scheduled" />
        </TabsContent>
        <TabsContent value="drafts">
          <ArticlesArticleList articleStatus="draft" />
        </TabsContent>
      </Tabs>
    </>
  )
}
