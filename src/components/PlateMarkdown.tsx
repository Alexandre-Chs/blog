import { useEffect } from 'react'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Typography } from '@tiptap/extension-typography'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'

import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

export interface PlateMarkdownProps {
  children: string
  className?: string
}

export function PlateMarkdown({ children, className }: PlateMarkdownProps) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
      }),
      Markdown,
      CodeBlock,
      HorizontalRule,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Typography,
    ],
    content: children,
    contentType: 'markdown',
  })

  useEffect(() => {
    if (editor && children) {
      editor.commands.setContent(children, { contentType: 'markdown' })
    }
  }, [children, editor])

  return <EditorContent editor={editor} className={className} />
}
