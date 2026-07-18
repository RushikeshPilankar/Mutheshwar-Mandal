import { useState } from "react";

export default function FilterBar({ onFilter, festivalYear }) {
  const [filterType, setFilterType] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const getDateRange = (type) => {
    const today = new Date();
    let start, end;

    if (type === "day") {
      start = end = today.toISOString().split("T")[0];
    } else if (type === "week") {
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay());
      const last = new Date(first);
      last.setDate(first.getDate() + 6);
      start = first.toISOString().split("T")[0];
      end = last.toISOString().split("T")[0];
    } else if (type === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    } else if (type === "year") {
      start = `${festivalYear}-01-01`;
      end = `${festivalYear}-12-31`;
    }
    return { start, end };
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
    if (type !== "custom") {
      const { start, end } = getDateRange(type);
      onFilter(start, end);
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onFilter(customStart, customEnd);
    }
  };

  return (
    <div className="filter-bar">
      {["day", "week", "month", "year"].map((type) => (
        <button
          key={type}
          className={filterType === type ? "active" : ""}
          onClick={() => handleFilterClick(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
      <button
        className={filterType === "custom" ? "active" : ""}
        onClick={() => setFilterType("custom")}
      >
        Custom
      </button>

      {filterType === "custom" && (
        <div className="custom-range">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <button onClick={handleCustomApply}>Apply</button>
        </div>
      )}
    </div>
  );
}