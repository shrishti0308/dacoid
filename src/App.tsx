'use client'

import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Calendar from './components/Calender'
import EventList from './components/EventList'
import EventModal from './components/EventModal'
import { Event } from './types/event'

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [filterKeyword, setFilterKeyword] = useState('')

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
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
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
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    event.description?.toLowerCase().includes(filterKeyword.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dynamic Event Calendar</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button onClick={handlePrevMonth} className="mr-2">Previous</Button>
          <Button onClick={handleNextMonth}>Next</Button>
        </div>
        <Button onClick={handleAddEvent}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
      </div>
      <Calendar
        currentDate={currentDate}
        events={filteredEvents}
        onDateClick={handleDateClick}
      />
      {selectedDate && (
        <EventList
          date={selectedDate}
          events={filteredEvents.filter(event => new Date(event.startTime).toDateString() === selectedDate.toDateString())}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={selectedDate}
      />
      <div className="mt-4">
        <input
          type="text"
          placeholder="Filter events..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
    </div>
  )
}