export const formatTripTime = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toLowerCase()
    .replace(" ", "");
};
