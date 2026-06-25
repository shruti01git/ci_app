import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  const [q, setQ] = useState(value ?? "");
  useEffect(() => setQ(value ?? ""), [value]);

  function handleSubmit(event) {
    event.preventDefault();
    onChange(q.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="search-bar__field">
        <Search className="search-bar__icon" />
        <input
          className="search-bar__input"
          placeholder="Search number plate, e.g. AP22KL6817"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          spellCheck="false"
          autoComplete="off"
        />
      </label>
      <button className="search-bar__button" type="submit">Search</button>
    </form>
  );
}
