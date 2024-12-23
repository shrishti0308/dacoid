import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Event, getEventColor } from '../types/event'

interface CalendarProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventDrop: (result: any) => void
}

export default function Calendar({ currentDate, events, onDateClick, onEventDrop }: CalendarProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    const days = getCalendarDays(currentDate)
    setCalendarDays(days)
  }, [currentDate])

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const days: Date[] = []

    // Add days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(year, month, -i))
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => new Date(event.startTime).toDateString() === date.toDateString())
  }

  return (
    <DragDropContext onDragEnd={onEventDrop}>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold p-2">{day}</div>
        ))}
        {calendarDays.map((day, index) => (
          <Droppable key={index} droppableId={day.toISOString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-2 border min-h-[100px] ${
                  isCurrentMonth(day) ? 'bg-white' : 'bg-gray-100'
                } cursor-pointer hover:bg-gray-50`}
                onClick={() => onDateClick(day)}
              >
                <div className={`text-right ${isToday(day) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''}`}>
                  {day.getDate()}
                </div>
                {getEventsForDate(day).map((event, eventIndex) => (
                  <Draggable key={event.id} draggableId={event.id} index={eventIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`text-xs ${getEventColor(event.type)} rounded p-1 mt-1 truncate`}
                      >
                        {event.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}