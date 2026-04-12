import { cn } from "@/components/legal-contest/ui";

function LotusSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <path
        d="M180 640c-58-34-98-84-120-150 42 16 83 18 124 6-18 42-19 82-4 120Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M180 640c58-34 98-84 120-150-42 16-83 18-124 6 18 42 19 82 4 120Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M180 560c-34-26-58-58-72-96 28 10 56 10 84 0-12 30-12 60 0 96Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M180 560c34-26 58-58 72-96-28 10-56 10-84 0 12 30 12 60 0 96Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M180 520c-26-22-44-48-54-78 22 8 43 8 64 0-10 24-12 50-10 78Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M180 520c26-22 44-48 54-78-22 8-43 8-64 0 10 24 12 50 10 78Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M180 460c-14-30-16-62-4-96 12 24 28 42 48 54-20 10-34 24-44 42Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <path
        d="M180 460c14-30 16-62 4-96-12 24-28 42-48 54 20 10 34 24 44 42Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default function LotusDecor() {
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-32 text-[color:var(--border-accent)] md:block">
        <LotusSvg className="opacity-35" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 text-[color:var(--border-accent)] md:block">
        <LotusSvg className="opacity-35" />
      </div>
    </>
  );
}
