import { useState, useEffect } from "react";

export default function SearchBar({ value, onChange }) {
  const [q, setQ] = useState(value ?? "");
  useEffect(() => setQ(value ?? ""), [value]);

  return (
    <div style={styles.wrap}>
      <input
        style={styles.input}
        placeholder="Search number plate (e.g., GJ01AB1234)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onChange(q)}
      />
      <button style={styles.btn} onClick={() => onChange(q)}>Search</button>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", gap: 8, padding: 12, position: "sticky", top: 0, background: "#fff", zIndex: 1000, borderBottom: "1px solid #eee" },
  input: { flex: 1, padding: "10px 12px", fontSize: 16, border: "1px solid #ccc", borderRadius: 6 },
  btn: { padding: "10px 16px", fontSize: 16, border: "1px solid #333", background: "#111", color: "#fff", borderRadius: 6, cursor: "pointer" }
};
