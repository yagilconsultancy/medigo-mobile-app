export const formatHumanReadableDate = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
