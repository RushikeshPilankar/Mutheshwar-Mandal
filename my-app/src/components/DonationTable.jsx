import { donationApi } from "../api/donationApi";

export default function DonationTable({ records, onDeleted, onStatusUpdate }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await donationApi.delete(id);
    onDeleted(id);
  };

  const handleMarkPaid = async (record) => {
    const updated = await donationApi.update(record.id, {
      ...record,
      status: "PAID",
    });
    onStatusUpdate(updated);
  };

  return (
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
        {records.length === 0 ? (
          <tr>
            <td colSpan="9" className="empty-row">
              No records found
            </td>
          </tr>
        ) : (
          records.map((r) => (
            <tr key={r.id}>
              <td>{r.pavtiNo}</td>
              <td>{r.name}</td>
              <td>{r.homeFlatNo}</td>
              <td>{r.mobileNo}</td>
              <td>₹{r.amount}</td>
              <td>{r.paymentMode}</td>
              <td>
                <span className={`status-badge ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.collectionDate}</td>
              <td>
                {r.status !== "PAID" && (
                  <button onClick={() => handleMarkPaid(r)}>Mark Paid</button>
                )}
                <button className="danger" onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}