const formatTimeOnly = (dateString: string | undefined): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Use device's local timezone (correct for all Canadian provinces automatically)
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto";

  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }); // Result example: "2:30 p.m." in en-CA
};

export default formatTimeOnly;
