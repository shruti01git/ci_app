import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useEffect, useState } from "react";
import { cameras, getCameraStats } from "../data";

// Fix default marker icons in Leaflet bundlers
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl, iconRetinaUrl, shadowUrl, iconSize: [25,41], iconAnchor: [12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Vehicle type display labels
const VEHICLE_TYPE_LABELS = {
  car: "Car",
  auto: "Auto",
  bus: "Bus",
  truck: "Truck",
  bike: "Bike",
};

// Format type counts for display
function formatTypeCounts(typeCounts) {
  if (!typeCounts || Object.keys(typeCounts).length === 0) {
    return "No vehicles";
  }
  return Object.entries(typeCounts)
    .map(([type, count]) => `${VEHICLE_TYPE_LABELS[type] || type}: ${count}`)
    .join(", ");
}

// Create stats lookup map (O(n) once, O(1) per marker)
function useCameraStatsMap() {
  return useMemo(() => {
    const statsArray = getCameraStats();
    const statsMap = {};
    statsArray.forEach((stat) => {
      statsMap[stat.cameraId] = stat;
    });
    return statsMap;
  }, []); // Empty deps = only computed once
}

// Custom hook for camera markers with stats
function useCameraMarkers() {
  const statsByCameraId = useCameraStatsMap();

  return useMemo(() => {
    return cameras.map((camera) => ({
      ...camera,
      stats: statsByCameraId[camera.id] || null,
    }));
  }, [statsByCameraId]);
}

function FitBounds({ events }) {
  const map = useMap();
  const bounds = useMemo(() => {
    if (!events || events.length === 0) return null;
    return L.latLngBounds(events.map(e => [e.lat, e.lng]));
  }, [events]);
  useEffect(() => { if (bounds) map.fitBounds(bounds.pad(0.2), { animate: false }); }, [bounds, map]);
  return null;
}

// Camera marker popup content
function CameraPopup({ camera }) {
  const { stats } = camera;

  if (!stats) {
    return (
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{camera.name}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>No stats available</div>
      </div>
    );
  }

  return (
    <div style={{ minWidth: 180 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 4 }}>
        {camera.name}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6 }}>
        <div>
          <span style={{ color: "#666" }}>Total Vehicles:</span>{" "}
          <strong>{stats.totalVehicles}</strong>
        </div>
        <div>
          <span style={{ color: "#666" }}>Unique Vehicles:</span>{" "}
          <strong>{stats.uniqueVehicles}</strong>
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: "#666", fontSize: 12 }}>Vehicle Types:</span>
          <div style={{ fontSize: 12, marginTop: 2 }}>
            {formatTypeCounts(stats.typeCounts)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapView({ events, query }) {
  const cameraMarkers = useCameraMarkers();
  const center = events?.[0] ? [events[0].lat, events[0].lng] : [16.5075, 80.6317];
  const positions = (events || []).map(e => [e.lat, e.lng]);

  // Road-snapped route state
  const [routeCoords, setRouteCoords] = useState(null);   // [[lat,lng], ...]
  const [routeErr, setRouteErr] = useState(null);

  useEffect(() => {
    setRouteCoords(null);
    setRouteErr(null);
    if (!events || events.length < 2) return;

    // OSRM expects "lng,lat" pairs separated by ";"
    const coordString = events.map(e => `${e.lng},${e.lat}`).join(";");

    const ctrl = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}` +
                `?alternatives=false&overview=full&geometries=geojson&steps=false`;

    fetch(url, { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => {
        if (data.code !== "Ok" || !data.routes?.[0]) {
          setRouteErr("No route found");
          return;
        }
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoords(coords);
      })
      .catch(err => {
        if (err.name !== "AbortError") setRouteErr(err.message || "Routing failed");
      });

    return () => ctrl.abort();
  }, [events]);

  return (
    <div style={{ height: 420, borderTop: "1px solid #eee", marginTop: 12 }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Camera markers with stats */}
        {cameraMarkers.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.lat, camera.lng]}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              <CameraPopup camera={camera} />
            </Popup>
          </Marker>
        ))}

        {/* Event markers (if any) */}
        {events && events.map(e => (
          <Marker key={`${e.cameraId}-${e.ts}`} position={[e.lat, e.lng]}>
            <Popup>
              <div style={{fontWeight:600}}>{e.name}</div>
              <div style={{fontSize:12, opacity:0.8}}>
                {e.cameraId}<br/>
                {new Date(e.ts).toLocaleString()}<br/>
                lat {e.lat.toFixed(4)}, lng {e.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}

        {routeCoords
          ? <Polyline positions={routeCoords} />
          // fallback: dashed straight segments if routing fails or not enough points
          : positions.length >= 2 && (
              <Polyline positions={positions} pathOptions={{ dashArray: "6 6" }} />
            )
        }

        <FitBounds events={events} />
      </MapContainer>

      <div style={{ padding: "8px 12px", fontSize: 13, color: routeErr ? "#a00" : "#555",
                    background: "#fff", borderBottom: "1px solid #eee" }}>
        {query
          ? routeErr ? `Route error: ${routeErr}` : `Route for: ${query}`
          : "Search a plate to view route"}
      </div>
    </div>
  );
}
