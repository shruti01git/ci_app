import { useState, useMemo } from "react";
import SearchBar from "./components/SearchBar.jsx";
import CameraList from "./components/CameraList.jsx";
import MapView from "./components/MapView.jsx";
import { getJourneyForPlate } from "./data.js";

export default function App() {
  const [query, setQuery] = useState("");
  const events = useMemo(() => (query ? getJourneyForPlate(query) : []), [query]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.title}>Plate Viewer</div>
      </header>

      <SearchBar value={query} onChange={setQuery} />
      <div style={styles.grid}>
        <div style={styles.left}>
          <CameraList events={events} query={query} />
        </div>
        <div style={styles.right}>
          <MapView events={events} query={query} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  header: { padding: "12px 12px 0" },
  title: { fontSize: 18, fontWeight: 700 },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 420px) 1fr",
    gap: 12,
    alignItems: "start",
    padding: 12
  },
  left: { minHeight: 200 },
  right: { minHeight: 420 }
};
