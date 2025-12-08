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

    const baseContext =
      aiSettings.context || 'You are an expert blog article writer for agencies, founders, and solopreneurs.'

    const formattingInstructions = `
      You MUST respond with a single valid JSON object and nothing else.
      The object must contain:
      - "title": string
      - "content": string (full article in Markdown)

      STRICT RULES:
      - The "content" field MUST NOT contain the title. Do NOT repeat or restate the title inside "content".
      - "content" must begin directly with an introduction paragraph or section — NEVER with "# {title}".
      - Use headings (##, ###), paragraphs, bullet lists.
      - NEVER use Markdown tables ("|").
      - Do not wrap JSON in code fences.
      - Output must be valid JSON, parseable by JSON.parse.
    `

    const systemContent = `${baseContext} You are the writing engine for this project. The preceding text is the global project context defined by the user. It MUST always guide tone, structure, and article positioning. ${formattingInstructions}`
    const userContent = `You must write a full article on the subject: "${data.subject}". The complementary information provided by the user is: "${data.additionalInfo ?? 'none'}". Follow the system rules strictly.`

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

    const raw = response.choices[0]?.message?.content || ''
    const parsed = JSON.parse(raw) as { title?: string; content?: string }

    let title = ''
    let content = ''

    if (parsed.title) title = parsed.title
    if (parsed.content) content = parsed.content

    if (!title && !content) throw new Error('AI response is missing title or content. Please try again.')

    return {
      title,
      content,
    }
  })
