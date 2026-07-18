export const YEARLY_STATIC_TOTALS = {
  2023: 500,
  2024: 1000,
  2025: 2000,
  2026: 3000,
};

export const getStaticTotalForYear = (year) => {
  return YEARLY_STATIC_TOTALS[year] ?? 0;
};