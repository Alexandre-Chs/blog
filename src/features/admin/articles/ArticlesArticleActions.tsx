import { Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { articlesArticleDelete } from './articles-article-delete.api'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ArticlesArticleActionsProps = {
  articleId: string
  articleStatus?: 'draft' | 'published' | 'scheduled'
}

export default function ArticlesArticleActions({ articleId }: ArticlesArticleActionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const articlesArticleDeletefn = useServerFn(articlesArticleDelete)

  const articleDeleteMutation = useMutation({
    mutationFn: articlesArticleDeletefn,
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
    <div className="flex gap-x-1">
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

      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete article"
                className="cursor-pointer text-red-600 hover:bg-red-600/10 hover:text-red-600"
              >
                <Trash2 />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <p>Delete article</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete article</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleArticleDelete}>
              Delete article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
