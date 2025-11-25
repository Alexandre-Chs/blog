import { eq } from 'drizzle-orm'
import { articles } from '@/db/schema'
import { db } from '@/index'

const randomSuffix = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  let suffix = ''

  for (let i = 0; i < 3; i += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length)
    suffix += alphabet[randomIndex]
  }

  return suffix
}

const slugify = (title: string) => {
  const sanitized = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'article'
}

export const generateUniqueSlug = async (slug: string) => {
  const baseSlug = slugify(slug.trim())

  const existingArticle = await db
    .select({ id: articles.id })
    .from(articles)
    .where(eq(articles.slug, baseSlug))
    .limit(1)

  if (!existingArticle.length) return baseSlug

  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    const candidateSlug = `${baseSlug}-${randomSuffix()}`

    const existingCandidate = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, candidateSlug))
      .limit(1)

    if (!existingCandidate.length) return candidateSlug
    attempts += 1
  }

  throw new Error('Unable to generate a unique slug. Please try again.')
}
