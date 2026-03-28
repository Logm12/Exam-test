"use client";

import { motion } from "framer-motion";

export default function Highlights({ guide }: { guide?: string }) {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-secondary)] mb-3">
              Giá trị
            </p>
            <div className="relative inline-block">
              <h2 className="text-5xl font-black tracking-tight text-[var(--text-primary)] sm:text-6xl">
                {guide ? "Hướng dẫn tham gia" : "Lợi ích tham gia"}
              </h2>
              <div className="mt-4 h-1 bg-gradient-to-r from-[var(--accent-secondary)] via-[var(--accent-secondary)] to-transparent mx-auto w-40" />
            </div>
          </motion.div>
        </div>

        {/* Info Boxes / Guide Text */}
        {guide ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-2xl p-8 sm:p-10 border border-[var(--border-default)] shadow-md"
          >
            <div 
              className="prose prose-invert max-w-none text-sm font-medium text-[var(--text-secondary)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: guide }}
            />
          </motion.div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] via-blue-700 to-blue-900 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-2xl" />
              <div className="relative rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] via-blue-700 to-blue-900 p-10 sm:p-12 text-white overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Decorative Elements */}
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white opacity-5 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-3xl font-black sm:text-4xl tracking-tight leading-tight mb-8">
                    Tại sao tham gia?
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="text-[var(--accent-secondary)] font-black text-2xl flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-base font-semibold leading-relaxed">Cập nhật kiến thức pháp luật Việt Nam</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-[var(--accent-secondary)] font-black text-2xl flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-base font-semibold leading-relaxed">Cộng điểm cho nhân viên, tập thể</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-[var(--accent-secondary)] font-black text-2xl flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-base font-semibold leading-relaxed">Chứng chỉ hoàn thành từ BTO</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent-secondary)] via-amber-400 to-orange-500 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-2xl" />
              <div className="relative rounded-3xl bg-gradient-to-br from-[var(--accent-secondary)] via-amber-400 to-orange-500 p-10 sm:p-12 text-white overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Decorative Elements */}
                <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white opacity-5 blur-3xl" />
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-3xl font-black sm:text-4xl tracking-tight leading-tight mb-8">
                    Quy trình dễ dàng
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="text-white font-black text-2xl flex-shrink-0">①</span>
                      <span className="text-base font-semibold leading-relaxed">Đăng nhập tài khoản của bạn</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-white font-black text-2xl flex-shrink-0">②</span>
                      <span className="text-base font-semibold leading-relaxed">Làm bài trắc nghiệm 30 phút</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-white font-black text-2xl flex-shrink-0">③</span>
                      <span className="text-base font-semibold leading-relaxed">Nhận điểm ngay lập tức</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
