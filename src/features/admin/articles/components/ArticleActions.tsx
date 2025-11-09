import { Pencil } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type ArticleActionsProps = {
  articleId: string
}

export default function ArticleActions({ articleId }: ArticleActionsProps) {
  const navigate = useNavigate()

  const handleArticleEdit = () => {
    navigate({ to: `/admin/articles/${articleId}/edit` })
  }

  return (
    <div className="gap-x-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit article"
            className="cursor-pointer"
            onClick={handleArticleEdit}
          >
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit article</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
