"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Code2, Globe } from "lucide-react";
import { ExamCategory } from "@/components/examhub/mockData";
import { cn } from "@/components/examhub/ui";

const iconMap: Record<ExamCategory, React.ReactNode> = {
  English: <BookOpen className="h-5 w-5" />,
  "IT & Programming": <Code2 className="h-5 w-5" />,
  "IQ & Logic": <Brain className="h-5 w-5" />,
  "General Knowledge": <Globe className="h-5 w-5" />,
};

export default function CategoryCard({
  category,
  quizzes,
  active,
  onClick,
}: {
  category: ExamCategory;
  quizzes: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "surface-card flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors",
        active && "ring-2 ring-[var(--border-accent)]"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            active ? "text-white" : "text-[var(--accent-primary)]"
          )}
          style={active ? { background: "var(--accent-gradient)" } : { background: "var(--bg-tertiary)" }}
          aria-hidden
        >
          {iconMap[category]}
        </div>
        <div>
          <div className="text-sm font-extrabold text-[var(--text-primary)]">{category}</div>
          <div className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">{quizzes} quizzes</div>
        </div>
      </div>

      <span className={cn("text-xs font-extrabold", active ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]")}>
        {active ? "Active" : "Pick"}
      </span>
    </motion.button>
  );
}
