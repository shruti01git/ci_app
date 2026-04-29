export default function CameraList({ events, query }) {
  if (!query) return <Empty>Type a number plate and hit Search</Empty>;
  if (!events || events.length === 0) return <Empty>No detections found for “{query}”.</Empty>;

  return (
    <div style={styles.box}>
      <div style={styles.header}>
        <div><b>Detections</b> ({events.length})</div>
        <div style={{opacity:0.7, fontSize:13}}>chronological</div>
      </div>
      <ul style={styles.list}>
        {events.map((e) => (
          <li key={`${e.cameraId}-${e.ts}`} style={styles.item}>
            <div style={{fontWeight:600}}>
              {e.name} <span style={styles.camId}>({e.cameraId})</span>
            </div>
            <div style={styles.meta}>
              {new Date(e.ts).toLocaleString()} • lat {e.lat.toFixed(4)}, lng {e.lng.toFixed(4)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty({ children }) {
  return <div style={styles.empty}>{children}</div>;
}

const styles = {
  box: { padding: "12px 12px 0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
  item: { padding: 12, border: "1px solid #eee", borderRadius: 8, background: "#fafafa" },
  meta: { fontSize: 13, opacity: 0.8, marginTop: 4 },
  camId: { fontWeight: 400, opacity: 0.7 },
  empty: { padding: 16, color: "#666" }
};
