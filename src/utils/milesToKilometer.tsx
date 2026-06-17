export const milesToKm = (miles: number | string | undefined, decimals = 1) => {
  const value = Number(miles || 0);
  return `${(value * 1.60934).toFixed(decimals)} km`;
};
