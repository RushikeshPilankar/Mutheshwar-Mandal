const BASE_URL = "http://localhost:8080/api/donations";

export const donationApi = {
  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  },

  getAll: async (festivalYear) => {
    const res = await fetch(`${BASE_URL}?festivalYear=${festivalYear}`);
    if (!res.ok) throw new Error("Failed to fetch records");
    return res.json();
  },

  filterByDateRange: async (start, end, festivalYear) => {
    const res = await fetch(
      `${BASE_URL}/filter?start=${start}&end=${end}&festivalYear=${festivalYear}`
    );
    if (!res.ok) throw new Error("Filter failed");
    return res.json();
  },

  getTotal: async (start, end, festivalYear) => {
    const res = await fetch(
      `${BASE_URL}/total?start=${start}&end=${end}&festivalYear=${festivalYear}`
    );
    if (!res.ok) throw new Error("Total fetch failed");
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
  },
};