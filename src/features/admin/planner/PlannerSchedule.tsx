import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarClock } from 'lucide-react'
import { useState } from 'react'

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function PlannerSchedule() {
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5])
  const [publishTime, setPublishTime] = useState('09:00')

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort(),
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
                variant={selectedDays.includes(index) ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => toggleDay(index)}
              >
                {day}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedDays.length === 0
              ? 'No days selected - auto-publishing is disabled'
              : `Auto-publish on: ${selectedDays.map((i) => WEEK_DAYS[i]).join(', ')}`}
          </p>
        </div>
        <div>
          <div>Publication Time</div>
          <Input
            id="publishTime"
            type="time"
            value={publishTime}
            onChange={(e) => setPublishTime(e.target.value)}
            className="w-full max-w-xs mt-2"
          />
        </div>
      </div>

      <Button className="ml-auto">Save Schedule</Button>
    </Card>
  )
}
