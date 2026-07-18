import { useState } from "react";
import { donationApi } from "../api/donationApi.js";

const initialState = {
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

export default function DonationForm({ onEntryAdded }) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pavtiNo: Number(formData.pavtiNo),
        amount: Number(formData.amount),
        festivalYear: Number(formData.festivalYear),
        upiId: formData.paymentMode === "UPI" ? formData.upiId : null,
        email: formData.email || null,
      };

      const created = await donationApi.create(payload);
      onEntryAdded(created);
      setFormData({
        ...initialState,
        pavtiNo: Number(formData.pavtiNo) + 1,
        festivalYear: formData.festivalYear,
      });
    } catch (err) {
      setError(err.message || "Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <h2>New Pavti Entry</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="form-row">
        <label>
          Pavti No.
          <input
            type="number"
            name="pavtiNo"
            value={formData.pavtiNo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Festival Year
          <input
            type="number"
            name="festivalYear"
            value={formData.festivalYear}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Name
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-row">
        <label>
          Home / Flat No.
          <input
            type="text"
            name="homeFlatNo"
            value={formData.homeFlatNo}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Mobile No.
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Amount (₹)
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Payment Mode
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </label>
      </div>

      {formData.paymentMode === "UPI" && (
        <label>
          UPI ID
          <input
            type="text"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            placeholder="name@okhdfcbank"
          />
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
          <input
            type="date"
            name="collectionDate"
            value={formData.collectionDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}