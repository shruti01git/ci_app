import { Camera, Clock3, MapPin, Route } from "lucide-react";

export default function CameraList({ events, query }) {
  if (!query) {
    return (
      <Empty icon={<Route className="h-5 w-5" />} title="Start a lookup" description="Enter a number plate to see the camera trail and detection timeline." />
    );
  }

  if (!events || events.length === 0) {
    return (
      <Empty icon={<Camera className="h-5 w-5" />} title="No detections found" description={`No cameras recorded plate ${query}.`} />
    );
  }

  const visibleEvents = events.slice(0, 5);
  const hiddenCount = Math.max(0, events.length - visibleEvents.length);
  const uniqueCameraCount = new Set(events.map((e) => e.cameraId)).size;

  return (
    <div className="camera-list">
      <div className="camera-list__header">
        <div>
          <div className="camera-list__eyebrow">Detections</div>
          <h2 className="camera-list__title">{uniqueCameraCount} camera visits</h2>
          <p className="camera-list__subtitle">Chronological order with coordinates and timestamps.</p>
        </div>
        <span className="camera-list__live-badge">
          <Clock3 className="icon-sm" /> Live trail
        </span>
      </div>

      <ul className="camera-list__items">
        {visibleEvents.map((event, index) => (
          <li key={`${event.cameraId}-${event.ts}`} className="camera-list__item">
            <div className="camera-list__item-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="camera-list__item-body">
              <div className="camera-list__item-top">
                <div>
                  <div className="camera-list__item-name">{event.name}</div>
                  <div className="camera-list__item-subtitle-row">
                    <MapPin className="icon-sm" />
                    {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
                  </div>
                </div>
                <span className="camera-list__camera-id">{event.cameraId}</span>
              </div>

              <div className="camera-list__meta-row">
                <span className="camera-list__pill">
                  <Clock3 className="icon-sm" />
                  {new Date(event.ts).toLocaleString()}
                </span>
                <span className="camera-list__pill camera-list__pill--accent">
                  <Camera className="icon-sm" />
                  {event.plate}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <div className="camera-list__footer">
          Showing {visibleEvents.length} of {events.length} detections
        </div>
      )}
    </div>
  );
}

function Empty({ title, description, icon }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <div className="empty-state__title">{title}</div>
      <div className="empty-state__description">{description}</div>
    </div>
  );
}
