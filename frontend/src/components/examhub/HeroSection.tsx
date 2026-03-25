"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users } from "lucide-react";
import { createRipple } from "@/components/examhub/ui";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Blurred blobs background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--accent-primary)", opacity: 0.12 }}
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--accent-secondary)", opacity: 0.12 }}
        animate={{ y: [0, -12, 0], x: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
            <Trophy className="h-4 w-4 text-[var(--accent-secondary)]" />
            Gamified quizzes • Daily streaks • Leaderboards
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Conquer Knowledge. <span className="text-gradient">Prove Your Skills.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Join thousands of learners taking quizzes daily. Start in seconds, level up with streaks,
            and climb the leaderboard.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.a
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="#featured"
              onClick={(e) => createRipple(e)}
              className="accent-btn ripple-btn inline-flex items-center justify-center gap-2 px-7 py-3 text-sm"
            >
              Start Now <ArrowRight className="h-4 w-4" />
            </motion.a>

            <motion.a
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="#categories"
              className="surface-card inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            >
              Explore Exams
            </motion.a>
          </div>

          {/* Floating stats */}
          <div className="flex flex-wrap gap-3 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card flex items-center gap-2 px-4 py-2 shadow-[var(--shadow-sm)]"
            >
              <Users className="h-4 w-4 text-[var(--accent-primary)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">10,000+ users</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card flex items-center gap-2 px-4 py-2 shadow-[var(--shadow-sm)]"
            >
              <Trophy className="h-4 w-4 text-[var(--accent-secondary)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">500+ exams</span>
            </motion.div>
          </div>
        </div>

        {/* Mock dashboard illustration */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="surface-card relative overflow-hidden rounded-2xl p-6 shadow-[var(--shadow-lg)]">
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full blur-3xl"
              style={{ background: "var(--accent-primary)", opacity: 0.14 }}
              aria-hidden
            />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl"
              style={{ background: "var(--accent-secondary)", opacity: 0.14 }}
              aria-hidden
            />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-[var(--text-primary)]">Today’s Challenge</div>
                <div className="rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  12 min
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Streak</div>
                  <div className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">7</div>
                  <div className="text-xs text-[var(--text-secondary)]">days</div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-xs font-semibold text-[var(--text-muted)]">Rank</div>
                  <div className="mt-2 text-2xl font-extrabold text-[var(--text-primary)]">#12</div>
                  <div className="text-xs text-[var(--text-secondary)]">this week</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                  <span>Progress</span>
                  <span>68%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div className="h-full w-[68%] rounded-full" style={{ background: "var(--accent-gradient)" }} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3">
                <div>
                  <div className="text-sm font-extrabold text-[var(--text-primary)]">+120 XP</div>
                  <div className="text-xs text-[var(--text-secondary)]">Finish a quiz today</div>
                </div>
                <div className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>
                  Boost
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
