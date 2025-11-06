import { DateTime } from 'luxon'

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null

  return DateTime.fromISO(dateString).toFormat('dd LLLL yyyy')
}
