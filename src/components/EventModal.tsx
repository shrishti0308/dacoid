import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from 'react'
import { Event, EventType } from '../types/event'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  event: Event | null
  selectedDate: Date | null
}

export default function EventModal({ isOpen, onClose, onSave, event, selectedDate }: EventModalProps) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<EventType>('other')

  useEffect(() => {
    if (event) {
      setName(event.name)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setDescription(event.description || '')
      setType(event.type)
    } else if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0]
      setStartTime(`${dateString}T09:00`)
      setEndTime(`${dateString}T10:00`)
      setName('')
      setDescription('')
      setType('other')
    }
  }, [event, selectedDate])

  const handleSave = () => {
    const newEvent: Event = {
      id: event ? event.id : Date.now().toString(),
      name,
      startTime,
      endTime,
      description,
      type
    }
    onSave(newEvent)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={type} onValueChange={(value: EventType) => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}