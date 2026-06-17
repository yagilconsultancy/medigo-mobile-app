export const formatDateReadable = (dateString: string): string => {
  if (!dateString) return "";

  const d = new Date(dateString);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
};
