import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Event, getEventColor } from '../types/event'

interface DayTimelineProps {
  date: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onEventDrop: (result: any) => void
  onDateChange: (date: Date) => void
}

export default function DayTimeline({ date, events, onEventClick, onEventDrop, onDateChange }: DayTimelineProps) {
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
      <DragDropContext onDragEnd={onEventDrop}>
        <Droppable droppableId={date.toISOString()} type="EVENT">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="relative h-[600px] overflow-y-auto">
              {timeSlots.map(hour => (
                <div key={hour} className="flex items-start h-20 border-t">
                  <div className="w-16 text-right pr-2 text-sm text-gray-500">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 relative">
                    {filteredEvents
                      .filter(event => new Date(event.startTime).getHours() === hour)
                      .map((event, index) => {
                        const startTime = new Date(event.startTime)
                        const endTime = new Date(event.endTime)
                        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                        const height = `${(duration / 60) * 100}%`
                        const top = `${(startTime.getMinutes() / 60) * 100}%`

                        return (
                          <Draggable key={event.id} draggableId={event.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`absolute left-0 right-0 p-1 text-xs ${getEventColor(event.type)} rounded overflow-hidden cursor-pointer`}
                                style={{
                                  top,
                                  height,
                                  minHeight: '20px',
                                  ...provided.draggableProps.style
                                }}
                                onClick={() => onEventClick(event)}
                              >
                                <div className="font-bold">{event.name}</div>
                                <div>{startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}</div>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                  </div>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}