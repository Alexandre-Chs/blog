export const prompts = {
  base: `
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
  `,
}
