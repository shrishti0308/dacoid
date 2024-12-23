import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from 'react'
import { Event, EventType } from '../types/event'

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  onDelete: (eventId: string) => void
  event: Event | null
}

export default function EventDetailsModal({ isOpen, onClose, onSave, onDelete, event }: EventDetailsModalProps) {
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
    }
  }, [event])

  const handleSave = () => {
    if (event) {
      const updatedEvent: Event = {
        ...event,
        name,
        startTime,
        endTime,
        description,
        type
      }
      onSave(updatedEvent)
    }
  }

  const handleDelete = () => {
    if (event) {
      onDelete(event.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
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
          <Button onClick={handleDelete} variant="destructive">Delete</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}