import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { PlateMarkdown } from '@/components/PlateMarkdown'
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

  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <main className="w-full py-6 md:py-20">
        <article className="space-y-10">
          <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-[3.2rem]">About</h1>

          <div className="pt-4 text-neutral-800">
            <PlateMarkdown className="prose prose-lg max-w-none leading-relaxed text-neutral-800">
              {about.value.content}
            </PlateMarkdown>
          </div>
        </article>
      </main>
    </div>
  )
}
