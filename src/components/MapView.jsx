import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cameras, getCameraStats, VEHICLE_TYPE_LABELS } from "../data.js";
import { Camera, MapPin } from "lucide-react";

const cameraIcon = L.divIcon({
  className: "leaflet-camera-icon",
  html: `<svg viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg" width="32" height="44" aria-hidden="true">
    <path d="M16 2C9.37 2 4 7.37 4 14c0 8.5 12 28 12 28s12-19.5 12-28C28 7.37 22.63 2 16 2z" fill="#5C9C8C"/>
    <circle cx="16" cy="14" r="6.5" fill="#F0D9E4"/>
  </svg>`,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  tooltipAnchor: [0, -36],
});

const routeIcon = L.divIcon({
  className: "leaflet-route-icon",
  html: `<svg viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg" width="32" height="44" aria-hidden="true">
    <path d="M16 2C9.37 2 4 7.37 4 14c0 8.5 12 28 12 28s12-19.5 12-28C28 7.37 22.63 2 16 2z" fill="#5C9C8C"/>
    <circle cx="16" cy="14" r="6.5" fill="#F0D9E4"/>
  </svg>`,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -40],
});

const highlightIcon = L.divIcon({
  className: "leaflet-highlight-icon",
  html: `<svg viewBox="0 0 36 50" xmlns="http://www.w3.org/2000/svg" width="36" height="50" aria-hidden="true">
    <path d="M18 2C10.5 2 5 8.06 5 15c0 9.15 13 30 13 30s13-20.85 13-30C31 8.06 25.5 2 18 2z" fill="#FFD166"/>
    <circle cx="18" cy="16" r="6" fill="#ffffff"/>
  </svg>`,
  iconSize: [36, 50],
  iconAnchor: [18, 50],
  tooltipAnchor: [0, -44],
});

function buildTypeCounts(typeCounts) {
  return Object.entries(typeCounts || {})
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .map(([type, count]) => ({
      type,
      label: VEHICLE_TYPE_LABELS[type] || type,
      count,
    }));
}

function FitBounds({ events }) {
  const map = useMap();
  const bounds = useMemo(() => {
    if (!events || events.length === 0) return null;
    return L.latLngBounds(events.map((event) => [event.lat, event.lng]));
  }, [events]);

  useEffect(() => {
    if (bounds) map.fitBounds(bounds.pad(0.2), { animate: false });
  }, [bounds, map]);

  return null;
}

function CameraHoverCard({ camera }) {
  const { stats } = camera;
  const typeCounts = buildTypeCounts(stats?.typeCounts);

  return (
    <div className="camera-tooltip">
      <div className="camera-tooltip__topline">
        <Camera className="h-4 w-4" />
        Camera
      </div>
      <div className="camera-tooltip__heading">{camera.name}</div>
      <div className="camera-tooltip__meta">{camera.id}</div>

      <div className="camera-tooltip__metrics">
        <div className="camera-tooltip__metric">
          <span>Total vehicles</span>
          <strong>{stats?.totalVehicles ?? 0}</strong>
        </div>
        <div className="camera-tooltip__metric">
          <span>Unique plates</span>
          <strong>{stats?.uniqueVehicles ?? 0}</strong>
        </div>
      </div>

      <div className="camera-tooltip__section-title">Vehicle mix</div>
      <div className="camera-tooltip__chips">
        {typeCounts.length > 0 ? (
          typeCounts.map((item) => (
            <span className="camera-tooltip__chip" key={item.type}>
              {item.label} <strong>{item.count}</strong>
            </span>
          ))
        ) : (
          <span className="camera-tooltip__empty">No detections recorded yet.</span>
        )}
      </div>
    </div>
  );
}

function EventPopup({ event }) {
  return (
    <div className="route-popup">
      <div className="route-popup__title">{event.name}</div>
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

export default function MapView({ events }) {
  const cameraStats = useMemo(() => getCameraStats(), []);
  const statsByCameraId = useMemo(() => {
    const lookup = new Map();
    cameraStats.forEach((stats) => lookup.set(stats.cameraId, stats));
    return lookup;
  }, [cameraStats]);

  const cameraMarkers = useMemo(
    () => cameras.map((camera) => ({
      ...camera,
      stats: statsByCameraId.get(camera.id) || null,
    })),
    [statsByCameraId]
  );

  // center on first event or default
  const center = events?.[0] ? [events[0].lat, events[0].lng] : [16.5075, 80.6317];

  // deduplicate events by cameraId in chronological order so routing uses one point per camera
  const dedupedByCamera = (events || []).reduce((acc, ev) => {
    if (!acc.find((e) => e.cameraId === ev.cameraId)) acc.push(ev);
    return acc;
  }, []);

  const positions = dedupedByCamera.map((event) => [event.lat, event.lng]);

  const [routeCoords, setRouteCoords] = useState(null);

  useEffect(() => {
    setRouteCoords(null);

    if (!dedupedByCamera || dedupedByCamera.length < 2) return;

    // Use one coordinate per camera (simplest road between cameras)
    const coordString = dedupedByCamera.map((event) => `${event.lng},${event.lat}`).join(";");
    const controller = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?alternatives=false&overview=full&geometries=geojson&steps=false`;

    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (data.code !== "Ok" || !data.routes?.[0]) {
          return;
        }

        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoords(coords);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          // Route error - silently fail
        }
      });

    return () => controller.abort();
  }, [events]);

  // latest camera (most recent detection) for highlight
  const latestEvent = events && events.length ? events[events.length - 1] : null;
  const latestCamera = latestEvent ? cameraMarkers.find((c) => c.id === latestEvent.cameraId) : null;

  return (
    <div className="map-view">
      <div className="map-view__frame">
        <MapContainer center={center} zoom={13} className="map-view__map">
          <TileLayer
            url="https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {cameraMarkers.map((camera) => (
            <Marker key={camera.id} position={[camera.lat, camera.lng]} icon={cameraIcon}>
              <Tooltip className="camera-tooltip-shell" direction="auto" offset={[0, 14]} opacity={1}>
                <CameraHoverCard camera={camera} />
              </Tooltip>
            </Marker>
          ))}

          {/* Keep only the fixed camera markers on the map.
              Event/location markers were removed to avoid redundancy —
              routes are still drawn as polylines. */}

          {routeCoords ? (
            <Polyline positions={routeCoords} pathOptions={{ weight: 4 }} />
          ) : (
            positions.length >= 2 && <Polyline positions={positions} pathOptions={{ dashArray: "6 6", weight: 3 }} />
          )}

          {/* Expand fit-bounds to include both cameras and the deduplicated route points */}
          <FitBounds events={[...cameraMarkers, ...dedupedByCamera]} />

          {/* Highlight latest camera for the searched vehicle (non-persistent) */}
          {latestCamera && (
            <Marker
              key={`highlight-${latestCamera.id}`}
              position={[latestCamera.lat, latestCamera.lng]}
              icon={highlightIcon}
              zIndexOffset={2200}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
