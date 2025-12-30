import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { plannerScheduleUpdate } from './planner-schedule-update.api'
import { toast } from 'sonner'
import { SettingsMap } from '@/zod/settings'
import { plannerScheduleRead } from './planner-schedule-read.api'
import { Skeleton } from '@/components/ui/skeleton'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function PlannerSchedule() {
  const plannerScheduleUpdateFn = useServerFn(plannerScheduleUpdate)
  const plannerScheduleReadFn = useServerFn(plannerScheduleRead)

  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ['planner-schedule'],
    queryFn: () => plannerScheduleReadFn(),
  })

  const plannerScheduleMutation = useMutation({
    mutationFn: async (data: SettingsMap['planner']) => {
      await plannerScheduleUpdateFn({ data })
    },
    onSuccess: () => {
      toast.success('Schedule planner updated successfully')
      queryClient.invalidateQueries({ queryKey: ['planner-schedule'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handlePublicationDaysClick = (dayIndex: number) => {
    if (!data?.publicationDays) return
    const selectedDaysNew = data.publicationDays.includes(dayIndex)
      ? data.publicationDays.filter((d: number) => d !== dayIndex)
      : [...data.publicationDays, dayIndex].sort()

    plannerScheduleMutation.mutate({ publicationDays: selectedDaysNew, publicationHour: data.publicationHour || 0 })
  }

  const handlePublicationHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hour = parseInt(e.target.value.split(':')[0], 10)
    if (!hour) return

    plannerScheduleMutation.mutate({ publicationDays: data?.publicationDays || [], publicationHour: hour })
  }

  if (isPending || !data) {
    return (
      <Card>
        <div className="flex items-center justify-between p-6 gap-x-6">
          <Skeleton className="h-8 flex flex-1" />
          <Skeleton className="h-8 flex flex-1" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div>Publication Days</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {WEEK_DAYS.map((day, index) => (
              <Badge
                key={day}
                variant={data?.publicationDays.includes(index) ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => handlePublicationDaysClick(index)}
              >
                {day}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {data?.publicationDays.length === 0
              ? 'No days selected - auto-publishing is disabled'
              : `Auto-publish on: ${data?.publicationDays.map((i) => WEEK_DAYS[i]).join(', ')}`}
          </p>
        </div>
        <div>
          <div>Publication Time</div>
          <Input
            id="publishTime"
            type="time"
            value={`${data.publicationHour.toString().padStart(2, '0')}:00`}
            onChange={handlePublicationHourChange}
            className="w-full max-w-xs mt-2"
          />
        </div>
      </div>
    </Card>
  )
}
