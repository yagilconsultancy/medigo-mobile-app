/**
 * "Good morning / afternoon / evening" based on the phone's local clock.
 * 12:00am - 11:59am morning, 12:00pm - 4:59pm afternoon, 5:00pm onward evening.
 */
export const getGreeting = (now: Date = new Date()): string => {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
