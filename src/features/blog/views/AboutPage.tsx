import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import Article from '@/features/blog/components/Article'
import { settingsAboutListBlog } from '@/features/blog/api/about'

export default function AboutPage() {
  const aboutFn = useServerFn(settingsAboutListBlog)

  const {
    data: about,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['aboutPage'],
    queryFn: () => aboutFn(),
  })

  if (isPending) {
    return (
      <div
        className="flex flex-1 items-center justify-center bg-white text-sm text-neutral-500"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Loading...
      </div>
    )
  }

  if (isError || !about) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white text-neutral-500">
        <p>About page not found.</p>
      </div>
    )
  }

  return <Article content={{ variant: 'page', title: 'About', content: about.value.content }} />
}
