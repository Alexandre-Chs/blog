import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import ArticlesList from '../components/ArticlesList'
import { articlesListCount } from '../api/list'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function ArticlesCount({ count }: { count: number }) {
  return <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">{count}</Badge>
}

export default function ArticlesPage() {
  const articlesListCountFn = useServerFn(articlesListCount)
  const { data: articlesCount } = useQuery({
    queryKey: ['articlesCount'],
    queryFn: articlesListCountFn,
  })

  if (!articlesCount) return null

  return (
    <>
      <Tabs defaultValue="published" className="max-w-3xl mx-auto pt-6 w-full">
        <TabsList>
          <TabsTrigger value="published">
            Published
            <ArticlesCount count={articlesCount['published']} />
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            <ArticlesCount count={articlesCount['scheduled']} />
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts
            <ArticlesCount count={articlesCount['draft']} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <ArticlesList articleStatus="published" />
        </TabsContent>
        <TabsContent value="scheduled">
          <ArticlesList articleStatus="scheduled" />
        </TabsContent>
        <TabsContent value="drafts">
          <ArticlesList articleStatus="draft" />
        </TabsContent>
      </Tabs>
    </>
  )
}
