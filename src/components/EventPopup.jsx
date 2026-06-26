import { MapPin } from "lucide-react";

export default function EventPopup({ event }) {
  return (
    <div className="route-popup">

      <div className="route-popup__title">
        {event.name}
      </div>

      <div className="route-popup__meta">
        <span>{event.cameraId}</span>
        <span>{new Date(event.ts).toLocaleString()}</span>
      </div>

      <div className="route-popup__coords">
        <MapPin className="h-4 w-4" />
        {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
      </div>

    </div>
  );
}