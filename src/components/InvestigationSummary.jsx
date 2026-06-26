import { Clock3, Camera, Route, ShieldCheck } from "lucide-react";

export default function InvestigationSummary({ events }) {
  if (!events || events.length === 0) return null;

  const first = events[0];
  const last = events[events.length - 1];

  const start = new Date(first.ts);
  const end = new Date(last.ts);

  const diff = Math.max(
    0,
    Math.floor((end.getTime() - start.getTime()) / 1000)
  );

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  // Demo confidence
  const confidence = Math.min(
    99,
    88 + events.length * 3
  );

  return (
    <div className="investigation-summary">

      <div className="summary-header">

        <ShieldCheck size={20} />

        <div>

          <h3>AI Investigation Summary</h3>

          <p>
            Automatically generated from vehicle detections
          </p>

        </div>

      </div>

      <div className="summary-text">

        Vehicle <strong>{first.plate}</strong> was first detected at{" "}
        <strong>{first.name}</strong> at{" "}
        <strong>{new Date(first.ts).toLocaleTimeString()}</strong>.

        <br /><br />

        It travelled through{" "}
        <strong>{events.length}</strong> camera locations and was last
        observed at{" "}
        <strong>{last.name}</strong> at{" "}
        <strong>{new Date(last.ts).toLocaleTimeString()}</strong>.

      </div>

      <div className="summary-stats">

        <div className="summary-card">

          <Camera size={18} />

          <span>Cameras</span>

          <strong>{events.length}</strong>

        </div>

        <div className="summary-card">

          <Clock3 size={18} />

          <span>Travel Time</span>

          <strong>
            {minutes}m {seconds}s
          </strong>

        </div>

        <div className="summary-card">

          <Route size={18} />

          <span>Last Seen</span>

          <strong>{last.name}</strong>

        </div>

        <div className="summary-card">

          <ShieldCheck size={18} />

          <span>Confidence</span>

          <strong>{confidence}%</strong>

        </div>

      </div>

    </div>
  );
}