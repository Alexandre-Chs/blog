const articles = [
  {
    id: 'article-001',
    title: '6 Technical Skills A Non-Technical Startup Founder Needs to Have',
    content:
      'By learning a small amount of technical skills, founders can better support their company and ship confidently alongside their teams.',
    status: 'published',
    author: 'john-griebel',
    slug: 'technical-skills-for-non-technical-founders',
    readTime: 8,
    views: 1842,
    createdAt: new Date('2024-10-18T09:00:00Z'),
    updatedAt: new Date('2024-10-19T07:15:00Z'),
    publishedAt: new Date('2024-10-19T09:00:00Z'),
  },
  {
    id: 'article-002',
    title: 'Why Simplicity Wins in Product Design',
    content:
      'A deep dive into why removing is often better than adding, and how teams can cultivate a sharper sense for what really matters.',
    status: 'published',
    author: 'jane-smith',
    slug: 'why-simplicity-wins-in-product-design',
    readTime: 6,
    views: 2104,
    createdAt: new Date('2024-10-08T14:30:00Z'),
    updatedAt: new Date('2024-10-10T08:45:00Z'),
    publishedAt: new Date('2024-10-10T10:00:00Z'),
  },
  {
    id: 'article-003',
    title: 'How to Keep Writing When No One Is Reading Yet',
    content:
      'Momentum is everything during the early days of publishing. Here are five rituals that help you keep hitting publish before the audience arrives.',
    status: 'published',
    author: 'alex-cho',
    slug: 'keep-writing-when-no-one-is-reading',
    readTime: 5,
    views: 987,
    createdAt: new Date('2024-09-28T07:10:00Z'),
    updatedAt: new Date('2024-09-30T11:22:00Z'),
    publishedAt: new Date('2024-09-30T12:00:00Z'),
  },
  {
    id: 'article-004',
    title: 'The Editorial OS: Systems for Publishing Every Week',
    content:
      'Behind every consistent publication sits a calendar, a checklist, and a cadence your readers can trust. Here is the operating system we rely on.',
    status: 'published',
    author: 'marie-lefebvre',
    slug: 'editorial-operating-system-for-weekly-publishing',
    readTime: 9,
    views: 1436,
    createdAt: new Date('2024-09-14T10:05:00Z'),
    updatedAt: new Date('2024-09-16T16:40:00Z'),
    publishedAt: new Date('2024-09-17T08:30:00Z'),
  },
  {
    id: 'article-005',
    title: 'Founder Letters: Writing Updates Your Team Will Actually Read',
    content:
      'Skip the vanity metrics and share the narrative your team needs. A framework for writing updates that keep everyone aligned and inspired.',
    status: 'published',
    author: 'darius-mendez',
    slug: 'founder-letters-writing-updates-your-team-reads',
    readTime: 7,
    views: 1195,
    createdAt: new Date('2024-08-26T06:45:00Z'),
    updatedAt: new Date('2024-08-27T13:52:00Z'),
    publishedAt: new Date('2024-08-28T09:15:00Z'),
  },
] as const

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const viewsFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
})

const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 3)

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-6">
          <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            smith.
          </span>
          <a
            href="#about"
            className="text-sm font-medium text-[#111] transition-colors duration-200 hover:text-[#555]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            About
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6" style={{ fontFamily: 'Merriweather, serif' }}>
        <section className="mt-16">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            Latest Articles
          </h1>

          <div className="mt-12 flex flex-col gap-16 lg:mt-16 lg:flex-row lg:gap-20">
            <div className="lg:flex-1 lg:min-w-0">
              {articles.map((article, index) => {
                const publishedDate = article.publishedAt ?? article.createdAt
                const isLast = index === articles.length - 1
                const isFirst = index === 0

                return (
                  <article
                    key={article.id}
                    className={`${isFirst ? 'pb-12' : 'py-12'} ${isLast ? '' : 'border-b border-gray-100'}`}
                  >
                    <p
                      className="text-sm uppercase tracking-wide text-gray-500"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {dateFormatter.format(publishedDate)}
                    </p>

                    <h2
                      className="mt-3 text-3xl font-semibold leading-snug text-[#1a1a1a]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {article.title}
                    </h2>

                    <p className="mt-5 text-lg leading-[1.8] text-gray-700">{article.content}</p>

                    <div className="mt-8 flex flex-col gap-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-1">
                        <span
                          className="text-sm font-semibold text-[#1a1a1a]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {article.author}
                        </span>
                      </div>

                      <a
                        href={`/blog/${article.slug}`}
                        className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-[#555]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Read more →
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="lg:sticky lg:top-24 lg:w-[30%] lg:min-w-[260px] lg:self-start">
              <h2 className="text-xl font-semibold text-[#1a1a1a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Popular Articles
              </h2>

              <div className="mt-6 divide-y divide-gray-100 border-t border-gray-100">
                {popularArticles.map((article) => (
                  <article key={article.id} className="py-6">
                    <a
                      href={`/blog/${article.slug}`}
                      className="text-base font-semibold text-[#111] transition-colors duration-200 hover:text-[#555]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {article.title}
                    </a>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{article.content}</p>
                    <p
                      className="mt-4 text-xs uppercase tracking-wide text-gray-500"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {viewsFormatter.format(article.views)} views · {article.readTime} min read
                    </p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100">
        <div
          className="mx-auto max-w-screen-lg px-6 py-10 text-center text-sm text-gray-500"
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          © 2025 BlogAI — Built with ❤️
        </div>
      </footer>
    </div>
  )
}

export default HomePage
