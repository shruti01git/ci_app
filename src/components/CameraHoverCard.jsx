import { Camera } from "lucide-react";
import { VEHICLE_TYPE_LABELS } from "../data";

function buildTypeCounts(typeCounts) {
  return Object.entries(typeCounts || {})
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      type,
      label: VEHICLE_TYPE_LABELS[type] || type,
      count,
    }));
}

export default function CameraHoverCard({ camera }) {
  const typeCounts = buildTypeCounts(camera.stats?.typeCounts);

  return (
    <div className="camera-tooltip">
      <div className="camera-tooltip__topline">
        <Camera className="h-4 w-4" />
        Camera
      </div>

      <div className="camera-tooltip__heading">
        {camera.name}
      </div>

      <div className="camera-tooltip__meta">
        {camera.id}
      </div>

      <div className="camera-tooltip__metrics">
        <div className="camera-tooltip__metric">
          <span>Total vehicles</span>
          <strong>{camera.stats?.totalVehicles ?? 0}</strong>
        </div>

        <div className="camera-tooltip__metric">
          <span>Unique plates</span>
          <strong>{camera.stats?.uniqueVehicles ?? 0}</strong>
        </div>
      </div>

      <div className="camera-tooltip__section-title">
        Vehicle Mix
      </div>

      <div className="camera-tooltip__chips">
        {typeCounts.map((item) => (
          <span
            key={item.type}
            className="camera-tooltip__chip"
          >
            {item.label}
            <strong>{item.count}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}