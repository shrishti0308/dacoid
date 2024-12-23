import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Event } from '../types/event'

interface TimeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (startTime: string, endTime: string) => void
  event: Event | null
  newDate: Date | null
}

export default function TimeConfirmationModal({ isOpen, onClose, onConfirm, event, newDate }: TimeConfirmationModalProps) {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (event && newDate) {
      const start = new Date(event.startTime)
      const end = new Date(event.endTime)
      setStartTime(`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`)
      setEndTime(`${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`)
    }
  }, [event, newDate])

  const handleConfirm = () => {
    if (newDate) {
      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = endTime.split(':').map(Number)
      
      const newStartTime = new Date(newDate)
      newStartTime.setHours(startHours, startMinutes, 0, 0)
      
      const newEndTime = new Date(newDate)
      newEndTime.setHours(endHours, endMinutes, 0, 0)
      
      onConfirm(newStartTime.toISOString(), newEndTime.toISOString())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Event Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">Start Time</label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">End Time</label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
