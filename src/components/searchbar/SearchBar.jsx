import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder || "Cari..."}
        className="search-input"
      />
      {query && (
        <button className="clear-btn" onClick={handleClear} title="Hapus pencarian">
          ✕
        </button>
      )}
    </div>
  );
}
