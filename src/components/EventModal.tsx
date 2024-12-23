import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from 'react'
import { Event } from '../types/event'

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

  useEffect(() => {
    if (event) {
      setName(event.name)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setDescription(event.description || '')
    } else {
      setName('')
      setStartTime('')
      setEndTime('')
      setDescription('')
    }
  }, [event])

  const handleSave = () => {
    const newEvent: Event = {
      id: event ? event.id : Date.now().toString(),
      name,
      startTime,
      endTime,
      description
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
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}