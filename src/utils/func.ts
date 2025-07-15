export function timestampToDaysPassed(timestamp: string): number {
  const now = new Date();
  const pastDate = new Date(timestamp);
  const diffTime = Math.abs(now.getTime() - pastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return diffDays;
}
