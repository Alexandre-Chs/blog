import { useImperativeHandle } from 'react'
import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { MarkdownPlugin } from '@platejs/markdown'
import { Plate, usePlateEditor } from 'platejs/react'
import type { PlateEditor as PlateEditorType } from 'platejs/react'
import { BlockquoteElement } from '@/components/ui/blockquote-node'
import { EditorContainer, Editor as PlateEditor } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { ToolbarButton } from '@/components/ui/toolbar'

type EditorPropsType = {
  ref: React.Ref<PlateEditorType>
  placeholder?: string
}

export default function Editor({ ref, placeholder }: EditorPropsType) {
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

  useImperativeHandle(ref, () => editor)

  return (
    <Plate editor={editor}>
      <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
        <div className="flex-1" />
        <ToolbarButton className="px-2">Reset</ToolbarButton>
      </FixedToolbar>
      <EditorContainer className="bg-white pb-4 rounded-b-xl">
        <PlateEditor placeholder={placeholder ? placeholder : 'Type your amazing content here...'} />
      </EditorContainer>
    </Plate>
  )
}

Editor.displayName = 'Editor'
