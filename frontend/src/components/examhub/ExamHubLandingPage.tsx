"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bell, Search, Zap } from "lucide-react";

import Navbar from "@/components/examhub/Navbar";
import HeroSection from "@/components/examhub/HeroSection";
import ExamCard from "@/components/examhub/ExamCard";
import CategoryCard from "@/components/examhub/CategoryCard";
import Leaderboard from "@/components/examhub/Leaderboard";
import Footer from "@/components/examhub/Footer";

import { leaderboardTop5, type Exam, type ExamCategory, type ExamStatus } from "@/components/examhub/mockData";
import { cn, createRipple, getCountdownParts } from "@/components/examhub/ui";

type ApiExam = {
  id: number;
  title: string;
  description: string | null;
  slug: string | null;
  cover_image: string | null;
  duration: number;
  start_time: string;
  created_at: string;
  is_published: boolean;
  question_count: number;
  participants: number;
};

const CATEGORY_ORDER: ExamCategory[] = ["English", "IT & Programming", "IQ & Logic", "General Knowledge"];

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
}

function apiOrigin() {
  return apiBase().replace(/\/api\/v1\/?$/, "");
}

function classifyCategory(text: string): ExamCategory {
  const t = text.toLowerCase();
  if (/(toeic|ielts|english|vocab|grammar)/.test(t)) return "English";
  if (/(it|program|coding|code|javascript|typescript|python|sql|java|c\+\+|node)/.test(t)) return "IT & Programming";
  if (/(iq|logic|reason|pattern|sequence)/.test(t)) return "IQ & Logic";
  return "General Knowledge";
}

function deriveStatus(startIso: string, durationMinutes: number): ExamStatus {
  const start = new Date(startIso).getTime();
  const end = start + durationMinutes * 60 * 1000;
  const now = Date.now();
  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "LIVE";
  return "PRACTICE";
}

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 900;

    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
      {display.toLocaleString()}
      {suffix ?? ""}
    </div>
  );
}

function Countdown({ targetIso }: { targetIso: string }) {
  const [parts, setParts] = useState(() => getCountdownParts(targetIso));

  useEffect(() => {
    const interval = setInterval(() => setParts(getCountdownParts(targetIso)), 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
      {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
    </div>
  );
}

export default function ExamHubLandingPage() {
  const [activeCategory, setActiveCategory] = useState<ExamCategory | "All">("All");
  const [query, setQuery] = useState("");

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const res = await fetch(`${apiBase()}/exams/public`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load exams (${res.status})`);

        const data: ApiExam[] = await res.json();
        const origin = apiOrigin();

        const mapped: Exam[] = data.map((e) => {
          const category = classifyCategory(`${e.title} ${e.description ?? ""}`);
          const status = deriveStatus(e.start_time, e.duration);
          const coverImageUrl = e.cover_image ? `${origin}${e.cover_image}` : undefined;

          return {
            id: String(e.id),
            title: e.title,
            description: e.description || "No description provided.",
            category,
            status,
            questions: e.question_count ?? 0,
            duration: `${e.duration} min`,
            participants: e.participants ?? 0,
            startsAt: e.start_time,
            coverImageUrl,
          };
        });

        mapped.sort((a, b) => new Date(b.startsAt || 0).getTime() - new Date(a.startsAt || 0).getTime());

        if (mounted) setExams(mapped);
      } catch (err) {
        if (mounted) setLoadError(err instanceof Error ? err.message : "Failed to load exams");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const base: Record<ExamCategory, number> = {
      English: 0,
      "IT & Programming": 0,
      "IQ & Logic": 0,
      "General Knowledge": 0,
    };
    for (const e of exams) base[e.category] += 1;
    return base;
  }, [exams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exams.filter((e) => {
      const matchQuery = q.length === 0 || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
      const matchCat = activeCategory === "All" || e.category === activeCategory;
      return matchQuery && matchCat;
    });
  }, [activeCategory, query, exams]);

  const featured = useMemo(() => {
    return [...filtered].sort((a, b) => b.participants - a.participants).slice(0, 4);
  }, [filtered]);

  const liveFiltered = useMemo(() => {
    const live = exams.filter((e) => e.status === "LIVE");
    if (activeCategory === "All") return live;
    return live.filter((e) => e.category === activeCategory);
  }, [activeCategory, exams]);

  const upcomingFiltered = useMemo(() => {
    const upcoming = exams.filter((e) => e.status === "UPCOMING");
    if (activeCategory === "All") return upcoming;
    return upcoming.filter((e) => e.category === activeCategory);
  }, [activeCategory, exams]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <main>
        <HeroSection />

        {/* Search */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="surface-card flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-sm)]">
            <Search className="h-5 w-5 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams..."
              className="w-full bg-transparent text-sm font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              aria-label="Search exams"
            />
            {query.length > 0 && (
              <button
                className="rounded-xl border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                onClick={() => setQuery("")}
                type="button"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Featured */}
        <section id="featured" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">Featured Exams</h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base">
                Exams pulled from the real system — start fast and come back daily.
              </p>
            </div>
            <div className="hidden sm:flex">
              <motion.a
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#live"
                className="surface-card px-5 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              >
                See Live
              </motion.a>
            </div>
          </div>

          {loading && <div className="mt-8 glass-card p-6 text-sm text-[var(--text-secondary)]">Loading exams…</div>}

          {loadError && (
            <div className="mt-8 glass-card p-6 text-sm text-[var(--text-secondary)]">Could not load exams: {loadError}</div>
          )}

          {!loading && !loadError && (
            <>
              <div className="mt-7 md:hidden">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
                  {featured.map((exam) => (
                    <div key={exam.id} className="w-[86%] shrink-0 snap-center">
                      <ExamCard exam={exam} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4">
                {featured.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>

              {featured.length === 0 && (
                <div className="mt-8 glass-card p-6 text-sm text-[var(--text-secondary)]">
                  No exams match your search. Try a different keyword.
                </div>
              )}
            </>
          )}
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">Categories</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">Pick a track — the filter applies across sections.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-extrabold",
                  activeCategory === "All"
                    ? "border-[var(--border-accent)] bg-[var(--bg-secondary)] text-[var(--accent-primary)]"
                    : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                )}
              >
                All
              </button>

              {CATEGORY_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-extrabold",
                    activeCategory === key
                      ? "border-[var(--border-accent)] bg-[var(--bg-secondary)] text-[var(--accent-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  )}
                >
                  {key} ({categoryCounts[key]})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_ORDER.map((key) => (
              <CategoryCard
                key={key}
                category={key}
                quizzes={categoryCounts[key]}
                active={activeCategory === key}
                onClick={() => setActiveCategory(key)}
              />
            ))}
          </div>
        </section>

        {/* Leaderboard + Gamification */}
        <section id="leaderboard" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Leaderboard users={leaderboardTop5} />

            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-lg)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Your Progress</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Streak + badges preview (demo).</p>
                </div>
                <div className="rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-extrabold text-[var(--text-secondary)]">Streak: 7</div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                    <span>Level progress</span>
                    <span>68%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                    <div className="h-full w-[68%] rounded-full" style={{ background: "var(--accent-gradient)" }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Badge</div>
                    <div className="mt-1 text-sm font-extrabold text-[var(--text-primary)]">Speedster</div>
                    <div className="text-xs text-[var(--text-secondary)]">Unlocked</div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Badge</div>
                    <div className="mt-1 text-sm font-extrabold text-[var(--text-primary)]">Streak 14</div>
                    <div className="text-xs text-[var(--text-secondary)]">Locked</div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs font-semibold text-[var(--text-muted)]">Badge</div>
                    <div className="mt-1 text-sm font-extrabold text-[var(--text-primary)]">Top 10</div>
                    <div className="text-xs text-[var(--text-secondary)]">Locked</div>
                  </div>
                </div>

                <div className="glass-card flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "var(--accent-gradient)" }}>
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[var(--text-primary)]">Daily bonus</div>
                      <div className="text-xs text-[var(--text-secondary)]">Finish 1 exam today</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="accent-btn ripple-btn px-4 py-2 text-xs"
                    onClick={(e) => createRipple(e)}
                  >
                    Claim
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live & Upcoming */}
        <section id="live" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">Live & Upcoming</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">Real-time status derived from exam schedule.</p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-[var(--text-primary)]">LIVE Exams</div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold text-white" style={{ background: "var(--status-danger)" }}>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  LIVE
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {liveFiltered.length === 0 && (
                  <div className="glass-card p-4 text-sm text-[var(--text-secondary)]">No live exams right now.</div>
                )}
                {liveFiltered.map((e) => (
                  <div key={e.id} className="glass-card flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="text-sm font-extrabold text-[var(--text-primary)]">{e.title}</div>
                      <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                        {e.questions} Q • {e.duration}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="accent-btn ripple-btn px-4 py-2 text-xs"
                      onClick={(ev) => createRipple(ev)}
                    >
                      Join Now
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-2xl p-6 shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-[var(--text-primary)]">UPCOMING</div>
                <div className="text-xs font-semibold text-[var(--text-muted)]">Countdown</div>
              </div>

              <div className="mt-5 space-y-3">
                {upcomingFiltered.length === 0 && (
                  <div className="glass-card p-4 text-sm text-[var(--text-secondary)]">No upcoming exams.</div>
                )}
                {upcomingFiltered.slice(0, 5).map((e) => (
                  <div key={e.id} className="glass-card flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="text-sm font-extrabold text-[var(--text-primary)]">{e.title}</div>
                      <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                        {e.questions} Q • {e.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {e.startsAt ? <Countdown targetIso={e.startsAt} /> : <div />}
                      <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="surface-card inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                        onClick={() => {}}
                      >
                        <Bell className="h-4 w-4" /> Remind Me
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card rounded-2xl p-6 shadow-[var(--shadow-lg)]">
              <div className="text-sm font-semibold text-[var(--text-secondary)]">Right now</div>
              <AnimatedCounter value={1245} />
              <div className="mt-1 text-sm text-[var(--text-secondary)]">users taking exams right now</div>
            </div>
            <div className="glass-card rounded-2xl p-6 shadow-[var(--shadow-lg)]">
              <div className="text-sm font-semibold text-[var(--text-secondary)]">All-time</div>
              <AnimatedCounter value={50000} suffix="+" />
              <div className="mt-1 text-sm text-[var(--text-secondary)]">exams completed</div>
            </div>
          </div>
        </section>

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--surface-overlay)] p-3 backdrop-blur-md md:hidden">
          <motion.a
            whileTap={{ scale: 0.98 }}
            href="#featured"
            className="accent-btn ripple-btn flex w-full items-center justify-center gap-2 py-3 text-sm"
            onClick={(e) => createRipple(e)}
          >
            Start Now
          </motion.a>
        </div>

        <div className="h-20 md:hidden" aria-hidden />
      </main>

      <Footer />
    </div>
  );
}
