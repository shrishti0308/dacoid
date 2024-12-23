import { useEffect, useState } from 'react'
import { Event } from '../types/event'
interface CalendarProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
}
export default function Calendar({ currentDate, events, onDateClick }: CalendarProps) {
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
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-bold p-2">{day}</div>
      ))}
      {calendarDays.map((day, index) => (
        <div
          key={index}
          className={`p-2 border ${isToday(day) ? 'bg-blue-100' : ''} ${
            isCurrentMonth(day) ? '' : 'text-gray-400'
          } cursor-pointer hover:bg-gray-100`}
          onClick={() => onDateClick(day)}
        >
          <div className="text-right">{day.getDate()}</div>
          {getEventsForDate(day).map(event => (
            <div key={event.id} className="text-xs bg-blue-200 rounded p-1 mt-1">
              {event.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}