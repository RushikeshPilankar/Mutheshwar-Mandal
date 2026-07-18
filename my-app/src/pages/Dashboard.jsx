import { useState, useEffect } from "react";
import { donationApi } from "../api/donationApi";

const FESTIVAL_YEAR = new Date().getFullYear();

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    paid: 0,
    pending: 0,
    cash: 0,
    upi: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await donationApi.getAll(FESTIVAL_YEAR);
        const total = data.reduce((sum, r) => sum + Number(r.amount), 0);
        const paid = data.filter((r) => r.status === "PAID").length;
        const pending = data.filter((r) => r.status !== "PAID").length;
        const cash = data
          .filter((r) => r.paymentMode === "CASH")
          .reduce((sum, r) => sum + Number(r.amount), 0);
        const upi = data
          .filter((r) => r.paymentMode === "UPI")
          .reduce((sum, r) => sum + Number(r.amount), 0);

        setStats({ total, count: data.length, paid, pending, cash, upi });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard — Ganpati {FESTIVAL_YEAR}</h1>
      <div className="stat-grid">
        <div className="stat-card highlight">
          <span>Total Collection</span>
          <strong>₹{stats.total.toLocaleString("en-IN")}</strong>
        </div>
        <div className="stat-card">
          <span>Total Entries</span>
          <strong>{stats.count}</strong>
        </div>
        <div className="stat-card">
          <span>Paid</span>
          <strong>{stats.paid}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="stat-card">
          <span>Cash Collected</span>
          <strong>₹{stats.cash.toLocaleString("en-IN")}</strong>
        </div>
        <div className="stat-card">
          <span>UPI Collected</span>
          <strong>₹{stats.upi.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    </div>
  );
}