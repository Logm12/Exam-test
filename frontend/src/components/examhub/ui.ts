import type React from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function createRipple(e: React.MouseEvent<HTMLElement>) {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();

  const ink = document.createElement("span");
  ink.className = "ripple-ink";

  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ink.style.width = `${size}px`;
  ink.style.height = `${size}px`;
  ink.style.left = `${x}px`;
  ink.style.top = `${y}px`;

  target.appendChild(ink);
  ink.addEventListener(
    "animationend",
    () => {
      ink.remove();
    },
    { once: true }
  );
}

export function formatCompactNumber(value: number) {
  return Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function getCountdownParts(targetIso: string) {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, done: diff === 0 };
}

export function thumbnailSvgDataUri(title: string) {
  const safe = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%231e3a8a'/>
      <stop offset='60%' stop-color='%23172554'/>
      <stop offset='100%' stop-color='%23f59e0b'/>
    </linearGradient>
    <filter id='b' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='18'/>
    </filter>
  </defs>
  <rect width='800' height='450' fill='url(%23g)'/>
  <circle cx='650' cy='110' r='90' fill='%23ffffff' opacity='0.18' filter='url(%23b)'/>
  <circle cx='160' cy='360' r='140' fill='%23ffffff' opacity='0.12' filter='url(%23b)'/>
  <text x='48' y='250' fill='white' opacity='0.92' font-family='Inter, system-ui, -apple-system, Segoe UI' font-size='46' font-weight='800'>${safe}</text>
  <text x='48' y='300' fill='white' opacity='0.78' font-family='Inter, system-ui, -apple-system, Segoe UI' font-size='22'>ExamHub • Quick challenge</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
