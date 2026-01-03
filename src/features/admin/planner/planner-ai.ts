import { eq } from 'drizzle-orm'
import OpenAI from 'openai'
import { settings } from '@/db/schema'
import { db } from '@/index'
import { validateSettings } from '@/zod/settings'
import { extractTitleAndContent } from '@/lib/openrouter/api'

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
