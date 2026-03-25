"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

import LotusDecor from "@/components/legal-contest/LotusDecor";
import { contestInfo } from "@/components/legal-contest/data";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "var(--accent-gradient)" }} />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.35)] via-[rgba(0,0,0,0.15)] to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56">
          <Image
            src="/contest.jpg"
            alt="Banner cuộc thi"
            fill
            priority
            className="object-cover opacity-25"
          />
        </div>
      </div>

      <LotusDecor />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/25">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            <span>Đoàn TNCS Hồ Chí Minh • Trường Quốc tế, ĐHQGHN</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-8"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/25">
              <Scale className="h-10 w-10 text-white" />
            </div>

            <h1 className="mt-6 text-balance text-3xl font-black tracking-tight text-white sm:text-5xl">
              {contestInfo.titleDisplay}
            </h1>
            <p className="mt-4 text-pretty text-sm font-semibold text-white/85 sm:text-lg">{contestInfo.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="#join"
              className="accent-btn inline-flex w-full items-center justify-center px-6 py-3 text-sm font-extrabold sm:w-auto"
            >
              Tham gia
            </a>
            <a
              href="#rules"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-extrabold text-white hover:bg-white/15 sm:w-auto"
            >
              Thể lệ
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
