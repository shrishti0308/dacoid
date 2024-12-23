export type EventType = "work" | "personal" | "other";

export interface Event {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  type: EventType;
}

export const getEventColor = (type: EventType): string => {
  switch (type) {
    case "work":
      return "bg-blue-200";
    case "personal":
      return "bg-green-200";
    case "other":
      return "bg-yellow-200";
    default:
      return "bg-gray-200";
  }
};