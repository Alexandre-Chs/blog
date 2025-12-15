import { Bot } from 'lucide-react'
import { EditorMarkdown } from '../PlateMarkdown'
import { cn } from '@/lib/utils'

function AiLoader({ className, streamingText }: { className?: string; streamingText: string }) {
  return (
    <div className={cn('flex items-start justify-center', className)}>
      <div className="bg-card border border-border/50 rounded-xl px-4 py-3 w-full max-w-3xl">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <Bot className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground mt-1">AI thinking</span>
              <div className="flex gap-0.5 mt-auto text-muted-foreground/60">
                <span className="animate-pulse-dot" style={{ animationDelay: '0s' }}>
                  .
                </span>
                <span className="animate-pulse-dot" style={{ animationDelay: '0.2s' }}>
                  .
                </span>
                <span className="animate-pulse-dot" style={{ animationDelay: '0.4s' }}>
                  .
                </span>
              </div>
            </div>
            {streamingText && (
              <div className="text-sm text-muted-foreground leading-relaxed">
                <div key={streamingText} className="line-clamp-1 truncate animate-fade-in">
                  <EditorMarkdown>{streamingText}</EditorMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AiLoader }
