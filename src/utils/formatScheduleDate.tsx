const formatScheduledDate = (dateString: string | undefined): string => {
  if (!dateString) return "";

  // Parse as local time in Canada (Eastern Time as default)
  const date = new Date(dateString);
  const now = new Date();

  const canadaLocale = "en-CA";
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Toronto";
  // Compare dates in Canada's timezone
  const toCanadaDateParts = (d: Date) => {
    const parts = new Intl.DateTimeFormat(canadaLocale, {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    return {
      year: Number(parts.find((p) => p.type === "year")?.value),
      month: Number(parts.find((p) => p.type === "month")?.value),
      day: Number(parts.find((p) => p.type === "day")?.value),
    };
  };

  const target = toCanadaDateParts(date);
  const current = toCanadaDateParts(now);

  const toMidnight = (p: { year: number; month: number; day: number }) =>
    new Date(p.year, p.month - 1, p.day).getTime();

  const diffDays = Math.round(
    (toMidnight(target) - toMidnight(current)) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  // Format as "Feb 24th" using Canada locale
  const month = date.toLocaleString(canadaLocale, {
    month: "short",
    timeZone,
  });
  const day = target.day;

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${month} ${getOrdinal(day)}`;
};

export default formatScheduledDate;
