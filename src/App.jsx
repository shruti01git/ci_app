import { useMemo, useState } from "react";
import { Camera } from "lucide-react";
import SearchBar from "./components/SearchBar.jsx";
import CameraList from "./components/CameraList.jsx";
import MapView from "./components/MapView.jsx";
import { cameras, getJourneyForPlate } from "./data.js";
import InvestigationSummary from "./components/InvestigationSummary";

export default function App() {
  const [query, setQuery] = useState("");
  const events = useMemo(() => (query ? getJourneyForPlate(query) : []), [query]);

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--one" />
      <div className="app-shell__glow app-shell__glow--two" />

      <div className="app-shell__content">
        <header className="hero-panel">
          <div className="hero-panel__top">
            <div>
              <h1 className="hero-panel__title">Plate Viewer</h1>
            </div>
            <span className="status-badge"><Camera className="icon-sm" /> {cameras.length} cameras</span>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </header>

        <div className="dashboard-grid">
          <aside className="sidebar-panel">
            <CameraList events={events} query={query} />
          </aside>

          <section className="map-panel">
            <MapView events={events} />
          </section>
        </div>
      </div>
    </div>
  );
}
