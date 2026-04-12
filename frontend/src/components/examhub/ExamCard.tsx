"use client";
import { motion } from "framer-motion";
import { Clock, Play, Users, FileText, Info } from "lucide-react";
import { Exam } from "@/components/examhub/mockData";
import { createRipple, formatCompactNumber, thumbnailSvgDataUri } from "@/components/examhub/ui";
import { useMemo, useState } from "react";

function StatusPill({ status }: { status: Exam["status"] }) {
  const label = status;
  const style = useMemo(() => {
    if (status === "LIVE") {
      return {
        background: "var(--status-danger)",
        color: "white",
      } as const;
    }
    if (status === "UPCOMING") {
      return {
        background: "var(--status-warning)",
        color: "white",
      } as const;
    }
    return {
      background: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
    } as const;
  }, [status]);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide"
      style={style}
    >
      {status === "LIVE" && <span className="h-2 w-2 animate-pulse rounded-full bg-white" />}
      {label}
    </span>
  );
}

function ExamDetailsModal({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-xl p-6 shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <StatusPill status={exam.status} />
              <div className="text-xs font-semibold text-[var(--text-secondary)]">{exam.category}</div>
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-[var(--text-primary)]">{exam.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{exam.description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="surface-card p-4">
            <div className="text-xs font-semibold text-[var(--text-muted)]">Questions</div>
            <div className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">{exam.questions}</div>
          </div>
          <div className="surface-card p-4">
            <div className="text-xs font-semibold text-[var(--text-muted)]">Duration</div>
            <div className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">{exam.duration}</div>
          </div>
          <div className="surface-card p-4">
            <div className="text-xs font-semibold text-[var(--text-muted)]">Players</div>
            <div className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">{formatCompactNumber(exam.participants)}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="surface-card px-5 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            onClick={onClose}
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="accent-btn ripple-btn inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
            onClick={(e) => {
              createRipple(e);
              onClose();
            }}
          >
            <Play className="h-4 w-4" /> Start Exam
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ExamCard({ exam }: { exam: Exam }) {
  const [open, setOpen] = useState(false);
  const thumb = thumbnailSvgDataUri(exam.title);
  const imageSrc = exam.coverImageUrl || thumb;

  return (
    <>
      <motion.article
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="group surface-card overflow-hidden rounded-2xl"
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={exam.title}
            loading="lazy"
            className="h-44 w-full object-cover sm:h-40"
          />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <StatusPill status={exam.status} />
          </div>

          {/* Hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/45" />
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="glass-card p-4 shadow-[var(--shadow-lg)]">
              <p className="text-sm font-semibold text-white">{exam.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="pointer-events-auto inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-white"
                  onClick={() => setOpen(true)}
                >
                  <Info className="h-4 w-4" /> View Details
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="pointer-events-auto accent-btn ripple-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm"
                  onClick={(e) => createRipple(e)}
                >
                  <Play className="h-4 w-4" /> Start
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-extrabold leading-snug text-[var(--text-primary)]">{exam.title}</h3>
              <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{exam.category}</div>
            </div>
            <div className="hidden sm:block">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="accent-btn ripple-btn inline-flex items-center gap-2 px-4 py-2 text-xs"
                onClick={(e) => createRipple(e)}
              >
                <Play className="h-4 w-4" /> Start Exam
              </motion.button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> {exam.questions} Q
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {exam.duration}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {formatCompactNumber(exam.participants)}
            </div>
          </div>

          <div className="mt-4 sm:hidden">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="accent-btn ripple-btn inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
              onClick={(e) => createRipple(e)}
            >
              <Play className="h-4 w-4" /> Start Exam
            </motion.button>
          </div>
        </div>
      </motion.article>

      {open && <ExamDetailsModal exam={exam} onClose={() => setOpen(false)} />}
    </>
  );
}
