import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Event, getEventColor } from '../types/event'

interface DayTimelineProps {
  date: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onDateChange: (date: Date) => void
}

interface PositionedEvent extends Event {
  width: number
  left: number
}

export default function DayTimeline({ date, events, onEventClick, onDateChange }: DayTimelineProps) {
  const [filterKeyword, setFilterKeyword] = useState('')

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    event.description?.toLowerCase().includes(filterKeyword.toLowerCase())
  )

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  const handlePrevDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    onDateChange(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    onDateChange(newDate)
  }

  const positionedEvents = useMemo(() => {
    const sortedEvents = [...filteredEvents].sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    const positionedEvents: PositionedEvent[] = []
    const columns: { endTime: number, column: number }[] = []

    sortedEvents.forEach(event => {
      const startTime = new Date(event.startTime).getTime()
      const endTime = new Date(event.endTime).getTime()

      // Find a suitable column
      let column = 0
      while (columns.some(col => col.endTime > startTime && col.column === column)) {
        column++
      }

      // Update columns
      columns.push({ endTime, column })

      // Calculate max columns for this time slot
      const overlappingColumns = columns.filter(col =>
        col.endTime > startTime
      ).length

      positionedEvents.push({
        ...event,
        width: 95 / overlappingColumns,
        left: (column * 95) / overlappingColumns,
      })
    })

    return positionedEvents
  }, [filteredEvents])

  const getEventPosition = (event: PositionedEvent) => {
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    // Calculate minutes since start of day for both times
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes()
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes()

    // Each hour slot is 80px (h-20 class), so multiply by (80/60) to get pixels per minute
    const pixelsPerMinute = 80 / 60
    const top = startMinutes * pixelsPerMinute
    const height = (endMinutes - startMinutes) * pixelsPerMinute

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `${event.left}%`,
      width: `${event.width}%`
    }
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevDay} variant="outline"><ChevronLeft className="h-4 w-4" /></Button>
        <h2 className="text-xl font-bold">{date.toDateString()}</h2>
        <Button onClick={handleNextDay} variant="outline"><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter events..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="relative h-[600px] overflow-y-auto border rounded-md">
        <div className="absolute inset-0">
          {timeSlots.map(hour => (
            <div key={hour} className="flex items-start h-20 border-t">
              <div className="w-16 text-right pr-2 text-sm text-muted-foreground py-1">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative border-l" />
            </div>
          ))}
          {positionedEvents.map((event) => {
            const position = getEventPosition(event)
            return (
              <div
                key={event.id}
                className={`absolute p-2 rounded-md cursor-pointer transition-opacity hover:opacity-90 ${getEventColor(event.type)} border-l-4`}
                style={{
                  ...position,
                  borderLeftColor: event.type === 'work' ? 'rgb(59, 130, 246)' :
                                 event.type === 'personal' ? 'rgb(16, 185, 129)' :
                                 'rgb(245, 158, 11)',
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium text-sm">{event.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                  {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}