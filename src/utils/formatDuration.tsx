export const formatDuration = (minutes: number | string | undefined) => {
  const totalMinutes = Number(minutes);

  if (!totalMinutes || totalMinutes < 0) return "0m";

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // Less than 1 hour
  if (hours === 0) {
    return `${mins}m`;
  }

  // Exact hour (e.g. 120 → 2h)
  if (mins === 0) {
    return `${hours}h`;
  }

  // Hour + minutes (e.g. 62 → 1h 2m)
  return `${hours}h ${mins}m`;
};
