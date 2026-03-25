"use client";

import { useEffect, useMemo, useState } from "react";

import { contestInfo } from "@/components/legal-contest/data";
import { cn, getCountdown, pad2 } from "@/components/legal-contest/ui";

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-5 text-center shadow-[var(--shadow-md)]">
      <div className="text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">{value}</div>
      <div className="text-xs font-semibold text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}

export default function Countdown() {
  const targetIso = contestInfo.endsAtIso;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(() => getCountdown(targetIso), [targetIso, tick]);

  return (
    <section className="bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-[var(--bg-tertiary)] px-4 py-2 text-xs font-extrabold text-[var(--text-secondary)]">
              {parts.isOver ? "CUỘC THI ĐÃ KẾT THÚC" : "CUỘC THI KẾT THÚC TRONG"}
            </div>
          </div>

          <div className={cn("mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4", parts.isOver && "opacity-90")}>
            <TimeBox label="Ngày" value={String(parts.days)} />
            <TimeBox label="Giờ" value={pad2(parts.hours)} />
            <TimeBox label="Phút" value={pad2(parts.minutes)} />
            <TimeBox label="Giây" value={pad2(parts.seconds)} />
          </div>
        </div>
      </div>
    </section>
  );
}
