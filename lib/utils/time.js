export function getOffsetDiffHours(fromTz, toTz) {
  const now = new Date();
  const from = new Date(now.toLocaleString("en-US", { timeZone: fromTz }));
  const to = new Date(now.toLocaleString("en-US", { timeZone: toTz }));
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60));
}
