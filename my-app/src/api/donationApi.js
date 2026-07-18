const BASE_URL = "https://crushed-gear-cold.ngrok-free.dev/api/donations";

export const donationApi = {
  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getAll: async (festivalYear) => {
    const res = await fetch(
      `${BASE_URL}?festivalYear=${festivalYear}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
      }
    );

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
