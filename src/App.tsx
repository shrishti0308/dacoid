'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Calendar from './components/Calendar'
import DayTimeline from './components/DayTimeline'
import EventModal from './components/EventModal'
import { Event } from './types/event'

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e))
    } else {
      setEvents([...events, { ...event, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
  }

  const handleEventDrop = (result: any) => {
    if (!result.destination) return

    const updatedEvents = Array.from(events)
    const [reorderedEvent] = updatedEvents.splice(result.source.index, 1)

    const newStartDate = new Date(result.destination.droppableId)
    const oldStartDate = new Date(reorderedEvent.startTime)
    const timeDiff = newStartDate.getTime() - oldStartDate.getTime()

    const updatedEvent = {
      ...reorderedEvent,
      startTime: new Date(oldStartDate.getTime() + timeDiff).toISOString(),
      endTime: new Date(new Date(reorderedEvent.endTime).getTime() + timeDiff).toISOString(),
    }

    updatedEvents.splice(result.destination.index, 0, updatedEvent)
    setEvents(updatedEvents)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dynamic Event Calendar</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button onClick={handlePrevMonth} variant="outline"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-lg font-medium">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <Button onClick={handleNextMonth} variant="outline"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Calendar
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventDrop={handleEventDrop}
          />
        </div>
        <div>
          {selectedDate && (
            <DayTimeline
              date={selectedDate}
              events={events.filter(event => new Date(event.startTime).toDateString() === selectedDate.toDateString())}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  )
}