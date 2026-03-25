export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function clampNonNegative(n: number) {
  return Math.max(0, n);
}

export function getCountdown(targetIso: string) {
  const t = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = clampNonNegative(t - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isOver: t <= now };
}

export function formatNumber(n: number) {
  return n.toLocaleString("vi-VN");
}
