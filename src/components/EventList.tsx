import { Button } from "@/components/ui/button"
import { Event } from '../types/event'

interface EventListProps {
  date: Date
  events: Event[]
  onEditEvent: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

export default function EventList({ date, events, onEditEvent, onDeleteEvent }: EventListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Events for {date.toDateString()}</h2>
      {events.length === 0 ? (
        <p>No events for this day.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} className="mb-2 p-2 border rounded">
              <h3 className="font-bold">{event.name}</h3>
              <p>Start: {new Date(event.startTime).toLocaleString()}</p>
              <p>End: {new Date(event.endTime).toLocaleString()}</p>
              {event.description && <p>{event.description}</p>}
              <div className="mt-2">
                <Button onClick={() => onEditEvent(event)} className="mr-2">Edit</Button>
                <Button onClick={() => onDeleteEvent(event.id)} variant="destructive">Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}