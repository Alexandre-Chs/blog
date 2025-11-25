import { Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { articleDelete } from '../api/delete'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type ArticleActionsProps = {
  articleId: string
  articleStatus?: 'draft' | 'published' | 'scheduled'
}

export default function ArticleActions({ articleId }: ArticleActionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const articleDeleteFn = useServerFn(articleDelete)

  const articleDeleteMutation = useMutation({
    mutationFn: articleDeleteFn,
    onSuccess: () => {
      toast.success('Article deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['articlesCount'] })
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while deleting the article.')
      }
    },
  })

  const handleArticleEdit = () => {
    navigate({ to: `/admin/articles/${articleId}/edit` })
  }

  const handleArticleDelete = () => {
    articleDeleteMutation.mutate({
      data: {
        articleId,
      },
    })
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete article"
            disabled={articleDeleteMutation.isPending}
            className="cursor-pointer text-red-600 hover:bg-red-600/10 hover:text-red-600"
            onClick={handleArticleDelete}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete artcle</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
