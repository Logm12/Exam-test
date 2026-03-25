"use client";

import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { LeaderboardUser } from "@/components/examhub/mockData";

function rankStyle(rank: number) {
  if (rank === 1) {
    return {
      badge: "bg-[var(--accent-secondary)] text-white",
      glow: true,
      icon: <Crown className="h-4 w-4" />,
    };
  }
  if (rank === 2) {
    return { badge: "bg-[var(--bg-tertiary)] text-[var(--text-primary)]", glow: false, icon: <Medal className="h-4 w-4" /> };
  }
  if (rank === 3) {
    return { badge: "bg-[var(--bg-tertiary)] text-[var(--text-primary)]", glow: false, icon: <Medal className="h-4 w-4" /> };
  }
  return { badge: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]", glow: false, icon: null };
}

export default function Leaderboard({ users }: { users: LeaderboardUser[] }) {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-[var(--shadow-lg)]">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "var(--accent-primary)", opacity: 0.12 }}
        aria-hidden
      />

      <div className="relative">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Leaderboard</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Top 5 this week</p>
          </div>
          <div className="text-xs font-semibold text-[var(--text-muted)]">Updated live</div>
        </div>

        <div className="mt-6 space-y-3">
          {users.slice(0, 5).map((u, idx) => {
            const rank = idx + 1;
            const s = rankStyle(rank);

            return (
              <motion.div
                key={u.username}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className={
                  "flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3 shadow-[var(--shadow-sm)] " +
                  (s.glow ? "ring-2 ring-[var(--accent-secondary)]/50" : "")
                }
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-2xl bg-[var(--bg-tertiary)]" aria-hidden>
                    <div className="h-full w-full" style={{ background: "var(--accent-gradient)", opacity: 0.65 }} />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-[var(--text-primary)]">{u.username}</div>
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Score</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-extrabold text-[var(--text-primary)]">{u.score.toLocaleString()}</div>
                  <div className={"inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold " + s.badge}>
                    {s.icon}
                    #{rank}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
