import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { plannerIdeasRead } from './planner-schedule-read.api'
import { plannerIdeaCreate } from './planner-idea-create.api'
import { plannerIdeaDelete } from './planner-idea-delete.api'
import { plannerIdeaRead } from './planner-idea-read.api'
import { plannerIdeaUpdate } from './planner-idea-update.api'

export function usePlannerIdeas() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [ideaEditId, setIdeaEditId] = useState<string | null>(null)
  const [idea, setIdea] = useState({ title: '', context: '' })

  const plannerIdeasReadFn = useServerFn(plannerIdeasRead)
  const plannerIdeaCreateFn = useServerFn(plannerIdeaCreate)
  const plannerIdeaReadFn = useServerFn(plannerIdeaRead)
  const plannerIdeaUpdateFn = useServerFn(plannerIdeaUpdate)
  const plannerIdeaDeleteFn = useServerFn(plannerIdeaDelete)
  const queryClient = useQueryClient()

  const { data: ideas = [], isPending } = useQuery({
    queryKey: ['planner-ideas'],
    queryFn: () => plannerIdeasReadFn(),
  })

  const { data: ideaEdit, isPending: ideaEditLoading } = useQuery({
    queryKey: ['planner-idea', ideaEditId],
    queryFn: () => plannerIdeaReadFn({ data: { id: ideaEditId! } }),
    enabled: !!ideaEditId,
  })

  const plannerIdeasMutation = useMutation({
    mutationFn: async (data: { title: string; context: string }) => {
      if (ideaEditId) await plannerIdeaUpdateFn({ data: { id: ideaEditId, data } })
      else await plannerIdeaCreateFn({ data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner-ideas'] })
      queryClient.invalidateQueries({ queryKey: ['planner-idea', ideaEditId] })
      setSheetOpen(false)
      setIdeaEditId(null)
      setIdea({ title: '', context: '' })
    },
  })

  const plannerIdeaDeleteMutation = useMutation({
    mutationFn: async (data: { ideaId: string }) => {
      await plannerIdeaDeleteFn({ data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner-ideas'] })
      toast.success('Idea deleted successfully')
    },
  })

  useEffect(() => {
    if (ideaEdit) setIdea({ title: ideaEdit.title || '', context: ideaEdit.context })
  }, [ideaEdit])

  const openSheet = () => setSheetOpen(true)

  const sheetOpenToggle = (open: boolean) => setSheetOpen(open)

  const openSheetEdit = (id: string) => {
    setIdeaEditId(id)
    setSheetOpen(true)
  }

  const ideaDelete = (id: string) => {
    plannerIdeaDeleteMutation.mutate({ ideaId: id })
  }

  const sheetReset = () => {
    setIdeaEditId(null)
    setIdea({ title: '', context: '' })
  }

  const ideaSave = (ideaData: { title: string; context: string }) => {
    plannerIdeasMutation.mutate(ideaData)
  }

  return {
    isPending,
    sheetOpen,
    idea,
    setIdea,
    ideas,
    ideaEditLoading,
    ideaEditId,
    openSheet,
    ideaDelete,
    openSheetEdit,
    isSaving: plannerIdeasMutation.isPending,
    isDeleting: plannerIdeaDeleteMutation.isPending,
    ideaSave,
    sheetReset,
    sheetOpenToggle,
  }
}
