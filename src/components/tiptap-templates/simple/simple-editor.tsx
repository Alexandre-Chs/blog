'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Typography } from '@tiptap/extension-typography'
import { Selection } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import type { Editor } from '@tiptap/react'

// --- UI Primitives ---
import { Button } from '@/components/tiptap-ui-primitive/button'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'

// --- Tiptap Node ---
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'

// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'

// --- Hooks ---
import { useIsBreakpoint } from '@/hooks/use-is-breakpoint'
import { useWindowSize } from '@/hooks/use-window-size'
import { useCursorVisibility } from '@/hooks/use-cursor-visibility'

// --- Styles ---
import '@/components/tiptap-templates/simple/simple-editor.scss'

import content from '@/components/tiptap-templates/simple/data/content.json'

export interface SimpleEditorRef {
  getMarkdown: () => string
  setMarkdown: (markdown: string) => void
  getHTML: () => string
  clear: () => void
  editor: Editor | null
}

export interface SimpleEditorProps {
  initialContent?: string
  onContentChange?: (markdown: string) => void
}

const MainToolbarContent = ({ onLinkClick, isMobile }: { onLinkClick: () => void; isMobile: boolean }) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} portal={isMobile} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <Spacer />
    </>
  )
}

const MobileToolbarContent = ({ onBack }: { onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        <LinkIcon className="tiptap-button-icon" />
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    <LinkContent />
  </>
)

export const SimpleEditor = forwardRef<SimpleEditorRef, SimpleEditorProps>((props, ref) => {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<'main' | 'link'>('main')
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'simple-editor',
      },
    },
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
      Selection,
    ],
    content: props.initialContent || content,
    contentType: props.initialContent ? 'markdown' : 'json',
    onUpdate: ({ editor: updatedEditor }) => {
      if (props.onContentChange) {
        const markdown = updatedEditor.getMarkdown()
        props.onContentChange(markdown)
      }
    },
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  useEffect(() => {
    if (editor && props.initialContent && editor.isEmpty) {
      editor.commands.setContent(props.initialContent, { contentType: 'markdown' })
    }
  }, [editor, props.initialContent])

  useImperativeHandle(
    ref,
    () => ({
      getMarkdown: () => {
        if (!editor) return ''
        return editor.getMarkdown()
      },
      setMarkdown: (markdown: string) => {
        if (!editor) return
        editor.commands.setContent(markdown, { contentType: 'markdown' })
      },
      getHTML: () => {
        if (!editor) return ''
        return editor.getHTML()
      },
      clear: () => {
        if (!editor) return
        editor.commands.clearContent()
      },
      editor,
    }),
    [editor],
  )

  return (
    <div className="">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === 'main' ? (
            <MainToolbarContent onLinkClick={() => setMobileView('link')} isMobile={isMobile} />
          ) : (
            <MobileToolbarContent onBack={() => setMobileView('main')} />
          )}
        </Toolbar>

        <EditorContent editor={editor} role="presentation" className="mt-2 bg-white p-2 rounded-lg min-h-44" />
      </EditorContext.Provider>
    </div>
  )
})

SimpleEditor.displayName = 'SimpleEditor'
