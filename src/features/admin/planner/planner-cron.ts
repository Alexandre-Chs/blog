import { randomUUID } from 'node:crypto'
import { Cron, scheduledJobs } from 'croner'
import { and, eq, gt, isNotNull, lt } from 'drizzle-orm'
import { plannerAi } from './planner-ai'
import { db } from '@/index'
import { articles, ideas, settings, user } from '@/db/schema'
import { validateSettings } from '@/zod/settings'
import { generateUniqueSlug } from '@/utils/slug'
import type { Idea } from '@/db/schema'

function plannerIdeasCron() {
  const existingJob = scheduledJobs.find((j) => j.name === 'planner-ideas')
  if (existingJob) existingJob.stop() // for hot-reloading scenarios

  new Cron('*/1 * * * *', { name: 'planner-ideas' }, async () => {
    let ideaNext: Idea[] | null = null

    try {
      console.log('🕒 Cron started at:', new Date().toISOString())

      const settingsPlanner = await db.select().from(settings).where(eq(settings.key, 'planner')).limit(1)

      if (!settingsPlanner.length) {
        console.log('❌ No planner settings found')
        return
      }

      const settingsPlannerValid = validateSettings('planner', settingsPlanner[0]?.value)

      const publicationDays = settingsPlannerValid.publicationDays
      const publicationHour = settingsPlannerValid.publicationHour || 9

      const today = new Date().getDay()
      const shouldPublishToday = publicationDays.includes(today)

      if (!shouldPublishToday) {
        console.log('📅 Not a publication day')
        return
      }

      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const timeThreshold = new Date(now.setHours(publicationHour, 0, 0, 0))

      const alreadyPublishedToday = await db
        .select()
        .from(ideas)
        .where(and(eq(ideas.status, 'published'), isNotNull(ideas.publishedAt), gt(ideas.publishedAt, startOfDay)))
        .limit(1)

      if (alreadyPublishedToday.length) {
        console.log('✅ Already published today, skipping')
        return
      }

      ideaNext = await db
        .select()
        .from(ideas)
        .where(and(eq(ideas.status, 'draft'), lt(ideas.createdAt, timeThreshold)))
        .limit(1)

      if (!ideaNext.length) {
        console.log('ℹ️ No idea to publish')
        return
      }

      await db.update(ideas).set({ status: 'generating' }).where(eq(ideas.id, ideaNext[0].id))

      const articleAiContent = await plannerAi({
        subject: ideaNext[0].subject,
        additionalInfo: ideaNext[0].context || '',
      })

      const titleGenerateAi = articleAiContent?.title
      const titleGenerateContent = articleAiContent?.content
      const title = ideaNext[0].title || titleGenerateAi // title create by user OR by ai

      console.log('🤖 AI generated article:', title)

      const adminUser = await db.select().from(user).where(eq(user.role, 'admin')).limit(1)

      if (!adminUser.length) {
        console.log('❌ No admin user found')
        return
      }

      const articleId = randomUUID()
      const slug = await generateUniqueSlug(title)

      await db.insert(articles).values({
        id: articleId,
        title,
        content: titleGenerateContent,
        authorId: adminUser[0].id,
        slug,
        publishedAt: new Date(),
      })

      console.log('📝 Article created:', articleId)

      await db.update(ideas).set({ status: 'published', publishedAt: new Date() }).where(eq(ideas.id, ideaNext[0].id))

      console.log('✅ Idea published:', ideaNext[0].id)
    } catch (error) {
      console.error('❌ Cron error:', error)
      if (ideaNext?.length) {
        await db.update(ideas).set({ status: 'failed' }).where(eq(ideas.id, ideaNext[0].id))
        ideaNext = null
      }
    } finally {
      ideaNext = null
      console.log('🏁 Cron finished at:', new Date().toISOString())
    }
  })

  console.log('🚀 Crons planner initialized')
}

export { plannerIdeasCron }
