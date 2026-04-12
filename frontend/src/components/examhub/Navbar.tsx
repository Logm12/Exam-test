"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--surface-overlay)] backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/landing" className="flex items-center justify-center">
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
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-[var(--text-secondary)] md:flex">
          <a href="#featured" className="hover:text-[var(--text-primary)]">
            Featured
          </a>
          <a href="#categories" className="hover:text-[var(--text-primary)]">
            Categories
          </a>
          <a href="#leaderboard" className="hover:text-[var(--text-primary)]">
            Leaderboard
          </a>
          <a href="#live" className="hover:text-[var(--text-primary)]">
            Live
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="#featured"
            className="accent-btn ripple-btn px-5 py-2 text-sm"
          >
            Start Now
          </motion.a>
        </div>
      </nav>
    </header>
  );
}
