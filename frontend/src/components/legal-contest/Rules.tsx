"use client";

import { motion } from "framer-motion";

const rules = [
  {
    title: "Thời gian",
    description: "Mỗi bài thi kéo dài 30 phút từ lúc bạn bắt đầu.",
    number: "01",
  },
  {
    title: "Hình thức",
    description: "Thi trắc nghiệm trực tuyến, mỗi câu 1 lựa chọn đúng.",
    number: "02",
  },
  {
    title: "Đầu vào",
    description: "Câu hỏi từ luật pháp Việt Nam, cập nhật 2025.",
    number: "03",
  },
  {
    title: "Điều kiện",
    description: "Mỗi thí sinh 1 tài khoản, không chia sẻ với ai.",
    number: "04",
  },
];

export default function Rules() {
  return (
    <section id="rules" className="relative overflow-hidden bg-[var(--bg-primary)] py-16 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -bottom-40 h-96 w-96 rounded-full bg-[var(--accent-primary)] opacity-5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-secondary)] mb-2">
            Quy định
          </p>
          <div className="relative inline-block">
            <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Thể lệ cuộc thi
            </h2>
            <div className="mt-3 h-1 bg-gradient-to-r from-[var(--accent-secondary)] via-[var(--accent-secondary)] to-transparent mx-auto w-32" />
          </div>
          <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] sm:text-base leading-relaxed max-w-2xl mx-auto">
            Những điều cần biết trước khi bạn tham gia. Nội dung có thể được cập nhật bởi Ban tổ chức.
          </p>
        </motion.div>

        {/* Rules Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full surface-card rounded-2xl p-8 sm:p-10 flex flex-col border-t-2 border-[var(--accent-secondary)] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Number Badge */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-secondary)] to-amber-500 mb-6 shadow-lg">
                  <span className="text-sm font-black text-white">{rule.number}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-black text-[var(--text-primary)]">{rule.title}</h3>
                <p className="mt-3 flex-1 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                  {rule.description}
                </p>


              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-2xl border-l-4 border-[var(--accent-secondary)] bg-gradient-to-r from-[var(--accent-secondary)]/10 to-transparent p-8 sm:p-10 shadow-md"
        >
          <h3 className="text-lg font-black text-[var(--text-primary)]">⚠️ Lưu ý quan trọng</h3>
          <ul className="mt-5 space-y-3 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-secondary)] font-black text-lg mt-0.5">•</span>
              <span>Bạn phải luôn trung thực khi làm bài. Mọi hành vi gian lận sẽ bị phát hiện và loại.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-secondary)] font-black text-lg mt-0.5">•</span>
              <span>Kết quả sẽ được công bố trên trang cá nhân ngay sau khi nộp bài.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent-secondary)] font-black text-lg mt-0.5">•</span>
              <span>Ban tổ chức có quyền thay đổi hoặc hủy các quy định nếu cần thiết.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
