import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'
import { extractTitleAndContent } from '@/features/admin/articles/articles-article-ai.api'
import { prompts } from '@/lib/openrouter/prompts'

export type plannerAiType = {
  subject: string
  additionalInfo?: string
}

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export async function plannerAi(data: plannerAiType): Promise<{ title: string; content: string }> {
  const { subject, additionalInfo = 'none' } = data
  const row = await db.select().from(settings).where(eq(settings.key, 'ai')).limit(1)
  const aiSettings = row.length ? validateSettings('ai', row[0].value) : { context: '', defaultModel: '' }

  if (!aiSettings.defaultModel) {
    // TODO discord alert admin
    throw new Error('No default AI model configured. Please set one in AI settings.')
  }

  const baseContext =
    aiSettings.context || 'You are an expert blog article writer for agencies, founders, and solopreneurs.'

  const formattingInstructions = prompts.base

  const systemContent = `${baseContext} You are the writing engine for this project. The preceding text is the global project context defined by the user. It MUST always guide tone, structure, and article positioning. ${formattingInstructions}`
  const userContent = `You must write a full article on the subject: "${subject}". The complementary information provided by the user is: "${additionalInfo}". Follow the system rules strictly.`

  const response = await openrouter.chat.completions.create({
    model: aiSettings.defaultModel,
    messages: [
      {
        role: 'system',
        content: systemContent,
      },
      {
        role: 'user',
        content: userContent,
      },
    ],
  })

  const { title, content } = extractTitleAndContent(response.choices[0].message.content || '')

  if (!title || !content) {
    // TODO discord alert admin
    throw new Error('AI did not return valid title or content')
  }

  return { title, content }
}
