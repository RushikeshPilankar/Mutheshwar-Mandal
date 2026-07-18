import { useState, useEffect, useMemo } from "react";
import { donationApi } from "../api/donationApi";
import VarganiModal from "../components/VarganiModal";
import Pagination from "../components/Pagination";

const FESTIVAL_YEAR = new Date().getFullYear();
const PAGE_SIZE = 10;

export default function Vargani() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Row 1 filters: date range + payment mode
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("ALL");

  // Row 2 filters: status + search text
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await donationApi.getAll(FESTIVAL_YEAR);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Why useMemo: filtering runs on every render otherwise, even when the
  // user is just typing in the Add form (unrelated state). useMemo re-runs
  // this O(n) filter pass only when records or a filter value actually changes.
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (startDate && r.collectionDate < startDate) return false;
      if (endDate && r.collectionDate > endDate) return false;
      if (paymentMode !== "ALL" && r.paymentMode !== paymentMode) return false;
      if (status !== "ALL" && r.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          String(r.pavtiNo).includes(q) ||
          (r.mobileNo && r.mobileNo.includes(q)) ||
          (r.homeFlatNo && r.homeFlatNo.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [records, startDate, endDate, paymentMode, status, search]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;

  const paginatedRecords = useMemo(() => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIdx, startIdx + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  // Reset to page 1 whenever filters narrow/widen the result set,
  // otherwise user could land on a now-empty page 5 of a 2-page result.
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, paymentMode, status, search]);

  const handleAddClick = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleSaved = (saved, wasEdit) => {
    if (wasEdit) {
      setRecords((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
    } else {
      setRecords((prev) => [saved, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await donationApi.delete(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPaymentMode("ALL");
    setStatus("ALL");
    setSearch("");
  };

  return (
    <div className="vargani-page">
      <div className="page-header">
        <h1>Vargani Collection</h1>
        <button className="add-btn" onClick={handleAddClick}>
          + Add Entry
        </button>
      </div>

      {/* Filter Row 1: date range + payment mode */}
      <div className="filter-row">
        <label>
          From
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Payment Mode
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="ALL">All</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </label>
      </div>

      {/* Filter Row 2: status + search */}
      <div className="filter-row">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
          </select>
        </label>
        <label className="search-field">
          Search (Name / Pavti No. / Mobile / Home)
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search..."
          />
        </label>
        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <p className="result-count">
        {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="donation-table">
            <thead>
              <tr>
                <th>Pavti No.</th>
                <th>Name</th>
                <th>Home/Flat</th>
                <th>Mobile</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-row">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r.id}>
                    <td>{r.pavtiNo}</td>
                    <td>{r.name}</td>
                    <td>{r.homeFlatNo}</td>
                    <td>{r.mobileNo}</td>
                    <td>₹{r.amount}</td>
                    <td>{r.paymentMode}</td>
                    <td>
                      <span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                    </td>
                    <td>{r.collectionDate}</td>
                    <td>
                      <button onClick={() => handleEditClick(r)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(r.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <VarganiModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editingRecord={editingRecord}
      />
    </div>
  );
}