import { useState, useEffect } from "react";
import { donationApi } from "../api/donationApi";

const emptyForm = {
  pavtiNo: "",
  name: "",
  homeFlatNo: "",
  address: "",
  mobileNo: "",
  email: "",
  amount: "",
  paymentMode: "CASH",
  upiId: "",
  status: "PAID",
  collectionDate: new Date().toISOString().split("T")[0],
  festivalYear: new Date().getFullYear(),
};

export default function VarganiModal({ isOpen, onClose, onSaved, editingRecord }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Why this effect: when `editingRecord` changes (user clicks Edit on a
  // different row, or clicks Add fresh), we re-sync local form state to match.
  useEffect(() => {
    if (editingRecord) {
      setFormData({ ...editingRecord });
    } else {
      setFormData(emptyForm);
    }
    setError("");
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        pavtiNo: Number(formData.pavtiNo),
        amount: Number(formData.amount),
        festivalYear: Number(formData.festivalYear),
        upiId: formData.paymentMode === "UPI" ? formData.upiId : null,
        email: formData.email || null,
      };

      let saved;
      if (editingRecord) {
        saved = await donationApi.update(editingRecord.id, payload);
      } else {
        saved = await donationApi.create(payload);
      }
      onSaved(saved, !!editingRecord);
      onClose();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingRecord ? "Edit Entry" : "New Pavti Entry"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Pavti No.
              <input type="number" name="pavtiNo" value={formData.pavtiNo} onChange={handleChange} required />
            </label>
            <label>
              Festival Year
              <input type="number" name="festivalYear" value={formData.festivalYear} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <div className="form-row">
            <label>
              Home / Flat No.
              <input type="text" name="homeFlatNo" value={formData.homeFlatNo} onChange={handleChange} />
            </label>
            <label>
              Address
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-row">
            <label>
              Mobile No.
              <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
            </label>
            <label>
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Amount (₹)
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
            </label>
            <label>
              Payment Mode
              <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </label>
          </div>

          {formData.paymentMode === "UPI" && (
            <label>
              UPI ID
              <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="name@okhdfcbank" />
            </label>
          )}

          <div className="form-row">
            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </label>
            <label>
              Collection Date
              <input type="date" name="collectionDate" value={formData.collectionDate} onChange={handleChange} required />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingRecord ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}