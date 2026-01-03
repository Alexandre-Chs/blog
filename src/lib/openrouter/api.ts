import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'
import { eq } from 'drizzle-orm'
import z from 'zod'
import type { OpenRouterModel } from './types'
import { db } from '@/index'
import { settings } from '@/db/schema'
import { validateSettings } from '@/zod/settings'
import { adminMiddleware } from '@/middlewares/admin'

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
  .middleware([adminMiddleware])
  .inputValidator(generateArticleSchema)
  .handler(async function* ({ data }) {
    const row = await db.select().from(settings).where(eq(settings.key, 'ai')).limit(1)
    const aiSettings = row.length ? validateSettings('ai', row[0].value) : { context: '', defaultModel: '' }

    if (!aiSettings.defaultModel) throw new Error('No default AI model configured. Please set one in AI settings.')

    const baseContext =
      aiSettings.context || 'You are an expert blog article writer for agencies, founders, and solopreneurs.'

    const formattingInstructions = `
      Write a full article in Markdown following this EXACT structure:
      
      - First line: The article title (plain text, no markdown formatting)
      - Second line: Empty line
      - Rest: The full article content in Markdown

      STRICT RULES:
      - First line is ONLY the title (no # or other formatting)
      - Do NOT repeat the title in the content
      - Content starts directly after the empty line

      EDITOR CAPABILITIES (TipTap):
      The content will be rendered in a TipTap editor. Use ONLY these supported elements:
      
      ✅ ALLOWED (EXHAUSTIVE LIST):
      - Headings (##, ###, ####, etc.)
      - Numbered lists (1. item, 2. item)
      - Bullet points (- item or * item)
      - Code blocks (\`\`\`language\ncode\n\`\`\`)
      - Bold (**text** or __text__)
      - Italic (*text* or _text_)
      - Strikethrough (~~text~~)
      - Underline (use HTML <u>text</u>)
      - Links ([text](url))

      ❌ STRICTLY FORBIDDEN - NEVER USE:
      - Tables (| col1 | col2 |)
      - Task lists (- [ ] or - [x])
      - Blockquotes (> text)
      - Horizontal rules / Separators (--- or *** or ___) - ABSOLUTELY NEVER USE THESE
      - Images (![alt](url))
      - Inline code (\`code\`)
      - HTML tags (except <u> for underline)
      - Footnotes
      - Definition lists
      - Any other Markdown syntax not explicitly listed in ALLOWED section
      
      CRITICAL: NEVER insert horizontal separators (---) between sections. Use headings to structure content instead.
    `

    const systemContent = `${baseContext} You are the writing engine for this project. The preceding text is the global project context defined by the user. It MUST always guide tone, structure, and article positioning. ${formattingInstructions}`
    const userContent = `You must write a full article on the subject: "${data.subject}". The complementary information provided by the user is: "${data.additionalInfo ?? 'none'}". Follow the system rules strictly.`

    const response = await openrouter.chat.completions.create({
      model: aiSettings.defaultModel,
      stream: true,
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

    let fullText = ''

    for await (const chunk of response) {
      const delta = chunk.choices[0]?.delta?.content || ''
      fullText += delta

      const parsed = extractTitleAndContent(fullText)

      yield {
        title: parsed.title,
        content: parsed.content,
        isComplete: false,
      }
    }

    const final = extractTitleAndContent(fullText)
    yield {
      title: final.title,
      content: final.content,
      isComplete: true,
    }
  })

export function extractTitleAndContent(text: string): { title: string; content: string } {
  const lines = text.split('\n')

  if (lines.length === 0) return { title: '', content: '' }
  const title = lines[0].trim()
  const contentLines = lines.slice(1)

  if (contentLines.length > 0 && contentLines[0].trim() === '') contentLines.shift()
  const content = contentLines.join('\n').trim()

  return { title, content }
}
