export const formatTripDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "Invalid Date";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = weekdays[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Returns: Sun, January 2026
  return `${dayName}, ${monthName} ${year}`;
};
