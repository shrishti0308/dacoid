import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { Event, getEventColor } from '../types/event'

interface DayTimelineProps {
  date: Date
  events: Event[]
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

export default function DayTimeline({ date, events, onEditEvent, onDeleteEvent }: DayTimelineProps) {
  const [filterKeyword, setFilterKeyword] = useState('')

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    event.description?.toLowerCase().includes(filterKeyword.toLowerCase())
  )

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Events for {date.toDateString()}</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter events..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="relative h-[600px] overflow-y-auto">
        {timeSlots.map(hour => (
          <div key={hour} className="flex items-start h-20 border-t">
            <div className="w-16 text-right pr-2 text-sm text-gray-500">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 relative">
              {filteredEvents
                .filter(event => new Date(event.startTime).getHours() === hour)
                .map(event => {
                  const startTime = new Date(event.startTime)
                  const endTime = new Date(event.endTime)
                  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                  const height = `${(duration / 60) * 100}%`
                  const top = `${(startTime.getMinutes() / 60) * 100}%`

                  return (
                    <div
                      key={event.id}
                      className={`absolute left-0 right-0 p-1 text-xs ${getEventColor(event.type)} rounded overflow-hidden`}
                      style={{ top, height, minHeight: '20px' }}
                    >
                      <div className="font-bold">{event.name}</div>
                      <div>{startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}</div>
                      <div className="mt-1">
                        <Button onClick={() => onEditEvent(event)} size="sm" className="mr-1">Edit</Button>
                        <Button onClick={() => onDeleteEvent(event.id)} size="sm" variant="destructive">Delete</Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}