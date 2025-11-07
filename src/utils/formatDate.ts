import { DateTime } from 'luxon'

export const formatDate = (dateString: Date | null) => {
  if (!dateString) return null

  return DateTime.fromJSDate(dateString).toFormat('dd LLLL yyyy')
}
