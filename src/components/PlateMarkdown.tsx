import { useEffect } from 'react'
import { Plate, PlateContent, usePlateEditor } from 'platejs/react'
import { MarkdownPlugin } from '@platejs/markdown'
import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { BlockquoteElement } from '@/components/ui/blockquote-node'
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node'

export interface PlateMarkdownProps {
  children: string
  className?: string
}

export function PlateMarkdown({ children, className }: PlateMarkdownProps) {
  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
      MarkdownPlugin,
    ],
  })

  useEffect(() => {
    // Désérialiser le Markdown en Plate value
    editor.tf.reset() // Vider le contenu précédent
    editor.tf.setValue(editor.getApi(MarkdownPlugin).markdown.deserialize(children))
  }, [children, editor])

  return (
    <Plate editor={editor}>
      <PlateContent readOnly className={className} />
    </Plate>
  )
}
