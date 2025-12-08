import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'
import { eq } from 'drizzle-orm'
import z from 'zod'
import type { OpenRouterModel } from './types'
import { db } from '@/index'
import { settings } from '@/db/schema'
import { validateSettings } from '@/zod/settings'

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export const getOpenrouterModels = createServerFn().handler(async (): Promise<Array<OpenRouterModel>> => {
  const response = await openrouter.models.list()
  return response.data as unknown as Array<OpenRouterModel>
})

const generateArticleSchema = z.object({
  subject: z.string().min(1),
  additionalInfo: z.string().optional(),
})

export const generateArticle = createServerFn({ method: 'POST' })
  .inputValidator(generateArticleSchema)
  .handler(async ({ data }) => {
    const row = await db.select().from(settings).where(eq(settings.key, 'ai')).limit(1)
    const aiSettings = row.length ? validateSettings('ai', row[0].value) : { context: '', defaultModel: '' }

    if (!aiSettings.defaultModel) throw new Error('No default AI model configured. Please set one in AI settings.')

    const response = await openrouter.chat.completions.create({
      model: aiSettings.defaultModel,
      messages: [
        {
          role: 'system',
          content: aiSettings.context || 'You are a helpful article writing assistant.',
        },
        {
          role: 'user',
          content: `Write a comprehensive article about: ${data.subject}${data.additionalInfo ? `\n\nAdditional context: ${data.additionalInfo}` : ''}`,
        },
      ],
    })

    return {
      content: response.choices[0]?.message?.content || '',
      model: aiSettings.defaultModel,
    }
  })
