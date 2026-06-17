export const formatDisplayText = (text?: string) => {
  if (!text) return "";

  return text
    .replace(/_/g, " ") // transport_only -> transport only
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
};
