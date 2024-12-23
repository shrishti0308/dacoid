'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Calendar from './components/Calendar'
import DayTimeline from './components/DayTimeline'
import EventDetailsModal from './components/EventDetailsModal'
import EventModal from './components/EventModal'
import TimeConfirmationModal from './components/TimeConfirmationModal'
import { Event } from './types/event'

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isTimeConfirmationModalOpen, setIsTimeConfirmationModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  const [newEventDate, setNewEventDate] = useState<Date | null>(null)

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

  const handleEventClick = (event: Event) => {
    setEditingEvent({
      ...event,
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16)
    })
    setIsDetailsModalOpen(true)
  }

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e))
    } else {
      setEvents([...events, { ...event, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
    setIsDetailsModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
    setIsDetailsModalOpen(false)
    setEditingEvent(null)
  }

  const handleEventDrop = (result: any) => {
    if (!result.destination) return

    const draggedEventId = result.draggableId
    const newDate = new Date(result.destination.droppableId)
    const draggedEvent = events.find(e => e.id === draggedEventId)

    if (draggedEvent) {
      setDraggedEvent(draggedEvent)
      setNewEventDate(newDate)
      setIsTimeConfirmationModalOpen(true)
    }
  }

  const handleTimeConfirmation = (newStartTime: string, newEndTime: string) => {
    if (draggedEvent && newEventDate) {
      const updatedEvent = {
        ...draggedEvent,
        startTime: newStartTime,
        endTime: newEndTime
      }
      setEvents(events.map(e => e.id === draggedEvent.id ? updatedEvent : e))
      setIsTimeConfirmationModalOpen(false)
      setDraggedEvent(null)
      setNewEventDate(null)
    }
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
          <DayTimeline
            date={selectedDate}
            events={events.filter(event => new Date(event.startTime).toDateString() === selectedDate.toDateString())}
            onEventClick={handleEventClick}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={null}
        selectedDate={selectedDate}
      />
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={editingEvent}
      />
      <TimeConfirmationModal
        isOpen={isTimeConfirmationModalOpen}
        onClose={() => setIsTimeConfirmationModalOpen(false)}
        onConfirm={handleTimeConfirmation}
        event={draggedEvent}
        newDate={newEventDate}
      />
    </div>
  )
}