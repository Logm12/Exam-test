"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { leaderboardIndividual, leaderboardTeam } from "@/components/legal-contest/data";
import type { LeaderboardMetric, LeaderboardRow, LeaderboardType } from "@/components/legal-contest/types";
import { cn, formatNumber } from "@/components/legal-contest/ui";

function StatCard({ totalExams, totalRegistrations }: { totalExams: number; totalRegistrations: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-lg)] sm:p-8">
      <div className="absolute inset-0" style={{ background: "var(--accent-gradient)" }} />
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-white/85">Tổng quan</div>
            <div className="mt-2 text-2xl font-black text-white">Thành tích cuộc thi</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
            <div className="text-xs font-semibold text-white/80">Tổng lượt thi</div>
            <div className="mt-2 text-3xl font-black tracking-tight text-white">{formatNumber(totalExams)}</div>
          </div>
          <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
            <div className="text-xs font-semibold text-white/80">Tổng lượt đăng ký</div>
            <div className="mt-2 text-3xl font-black tracking-tight text-white">{formatNumber(totalRegistrations)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightBadge({ rank }: { rank: number }) {
  const label = rank === 1 ? "TOP 1" : rank === 2 ? "TOP 2" : "TOP 3";
  const bg =
    rank === 1
      ? "bg-[var(--accent-primary)]"
      : rank === 2
        ? "bg-[var(--accent-primary-hover)]"
        : "bg-[var(--accent-secondary)]";
  return <span className={cn("rounded-full px-3 py-1 text-[11px] font-black text-white", bg)}>{label}</span>;
}

function Row({ row, rank }: { row: LeaderboardRow; rank: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3",
        "border-[var(--border-subtle)] bg-[var(--surface-card)]",
        rank <= 3 && "bg-[var(--bg-tertiary)] border-[var(--border-default)]"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black",
            rank <= 3 ? "bg-[var(--bg-secondary)] text-[var(--accent-primary)]" : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
          )}
        >
          {rank}
        </div>
        <div>
          <div className="text-sm font-extrabold text-[var(--text-primary)]">{row.name}</div>
          <div className="text-xs font-semibold text-[var(--text-secondary)]">Lượt đăng ký</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {rank <= 3 && <HighlightBadge rank={rank} />}
        <div className="text-sm font-black tabular-nums text-[var(--text-primary)]">{formatNumber(row.registrations)}</div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [type, setType] = useState<LeaderboardType>("team");
  const [metric, setMetric] = useState<LeaderboardMetric>("registrations");
  const [page, setPage] = useState(1);

  const pageSize = 6;
  const allRows = type === "team" ? leaderboardTeam : leaderboardIndividual;

  const sorted = useMemo(() => {
    if (metric === "registrations") return [...allRows].sort((a, b) => b.registrations - a.registrations);
    return [...allRows];
  }, [allRows, metric]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, clampedPage]);

  const totalRegistrations = useMemo(() => sorted.reduce((sum, r) => sum + r.registrations, 0), [sorted]);
  const totalExams = 0;

  return (
    <section id="leaderboard" className="bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatCard totalExams={totalExams} totalRegistrations={totalRegistrations} />

          <div className="surface-card rounded-3xl p-6 shadow-[var(--shadow-lg)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-secondary)]">BXH</div>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-primary)]">BẢNG XẾP HẠNG</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Loại
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as LeaderboardType);
                      setPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border-accent)]"
                  >
                    <option value="team">Tập thể</option>
                    <option value="individual">Cá nhân</option>
                  </select>
                </label>

                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  Chỉ số
                  <select
                    value={metric}
                    onChange={(e) => {
                      setMetric(e.target.value as LeaderboardMetric);
                      setPage(1);
                    }}
                    className="mt-1 w-full rounded-xl border border-[var(--border-default)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[color:var(--border-accent)]"
                  >
                    <option value="registrations">Lượt đăng ký</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {paged.map((row, idx) => (
                <Row key={row.id} row={row} rank={(clampedPage - 1) * pageSize + idx + 1} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-[var(--text-secondary)]">
                Trang {clampedPage}/{totalPages}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={clampedPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-extrabold",
                    clampedPage <= 1
                      ? "border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  )}
                  type="button"
                >
                  Trước
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={clampedPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-extrabold",
                    clampedPage >= totalPages
                      ? "border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      : "border-[var(--border-default)] bg-white text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  )}
                  type="button"
                >
                  Sau
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
