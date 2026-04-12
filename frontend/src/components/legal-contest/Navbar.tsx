"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/components/legal-contest/ui";

const navItems = [
  { label: "Trang chủ", href: "#home" },
  { label: "Thể lệ", href: "#rules" },
  { label: "Trợ giúp", href: "#faq" },
];

function Avatar() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <div className="text-sm font-bold text-[var(--text-primary)]">Sinh viên</div>
        <div className="text-xs text-[var(--text-secondary)]">Tài khoản</div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-sm font-extrabold text-[var(--text-primary)] shadow-[var(--shadow-sm)]">
        SV
      </div>
    </div>
  );
}

export default function Navbar({ examTitle }: { examTitle?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface-overlay)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <div className="relative h-10 w-36 sm:h-11 sm:w-44">
            <Image
              src="/logofdb.jpeg"
              alt="Logo FDB"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              priority
              className="object-contain"
            />
          </div>
          {examTitle && (
            <div className="leading-tight hidden sm:block max-w-[220px]">
              <div className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] line-clamp-2">
                {examTitle}
              </div>
            </div>
          )}
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "transition-colors"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="#join"
            className="accent-btn hidden px-4 py-2 text-sm font-extrabold sm:inline-flex"
          >
            Tham gia
          </motion.a>
          <Avatar />
        </div>
      </div>
    </header>
  );
}
