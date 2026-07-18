import { useState } from "react";
import { donationApi } from "../api/donationApi";

const FESTIVAL_YEAR = new Date().getFullYear();

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [total, setTotal] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const [totalAmount, data] = await Promise.all([
        donationApi.getTotal(start, end, FESTIVAL_YEAR),
        donationApi.filterByDateRange(start, end, FESTIVAL_YEAR),
      ]);
      setTotal(totalAmount);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <div className="filter-row">
        <label>
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <button onClick={runReport} disabled={loading}>
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </div>

      {total !== null && (
        <div className="report-summary">
          <p>
            Total collected between <strong>{start}</strong> and <strong>{end}</strong>:
          </p>
          <h2>₹{total.toLocaleString("en-IN")}</h2>
          <p>{records.length} entries in this range</p>
        </div>
      )}
    </div>
  );
}