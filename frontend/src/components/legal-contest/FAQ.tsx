"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/components/legal-contest/ui";

const DEFAULT_FAQS = [
  {
    q: "🚀 Làm cách nào để bắt đầu tham gia?",
    a: "Đăng nhập vào tài khoản của bạn bằng email hoặc tài khoản Google. Sau đó nhấn nút 'Tham gia', đọc kỹ hướng dẫn, và bắt đầu làm bài trắc nghiệm. Thời gian làm bài sẽ được đếm ngược từ lúc bạn bắt đầu.",
  },
  {
    q: "📊 Mình có thể xem kết quả ở đâu?",
    a: "Sau khi nộp bài, bạn có thể xem kết quả ngay lập tức tại trang 'Kết quả' hoặc trong mục 'Hồ sơ cá nhân'. Điểm của bạn sẽ được cập nhật vào bảng xếp hạng chung trong khoảng thời gian 5-10 phút.",
  },
  {
    q: "🔐 Tôi được phép đăng nhập bằng nhiều tài khoản không?",
    a: "Không, mỗi thí sinh phải sử dụng chỉ một tài khoản duy nhất. Việc sử dụng nhiều tài khoản được coi là gian lận và sẽ bị loại khỏi cuộc thi. Chúng tôi có hệ thống kiểm soát để phát hiện điều này.",
  },
  {
    q: "🛡️ Thông tin cá nhân của tôi sẽ được bảo mật như thế nào?",
    a: "Hệ thống bảo mật tuân thủ quy định của pháp luật Việt Nam. Thông tin của bạn chỉ được sử dụng để phục vụ cuộc thi và không chia sẻ với bên thứ ba ngoài các cơ quan được ủy quyền.",
  },
];

function Item({
  title,
  body,
  open,
  onToggle,
}: {
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={false}
      className={cn(
        "w-full text-left",
        "surface-card rounded-xl px-6 py-5 transition-all duration-200",
        open && "ring-2 ring-[var(--accent-secondary)]/30"
      )}
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-extrabold text-[var(--text-primary)] sm:text-base flex-1">{title}</div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-[var(--accent-secondary)]" />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-4 pt-4 border-t border-[var(--border-default)] text-sm font-semibold leading-relaxed text-[var(--text-secondary)]">
              {body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface FAQProps {
  contactEmail?: string;
  contactPhone?: string;
  organizerName?: string;
  faqs?: { q: string; a: string }[];
}

export default function FAQ({ contactEmail, contactPhone, organizerName, faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const email = contactEmail || "btc@example.com";
  const phone = contactPhone || "(024) 1234 5678";
  const orgName = organizerName || "Ban tổ chức";

  return (
    <section id="faq" className="relative overflow-hidden bg-[var(--bg-secondary)] py-16 sm:py-24">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-[var(--accent-secondary)] opacity-5 blur-3xl" />
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
            Câu hỏi thường gặp
          </p>
          <div className="relative inline-block">
            <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Hướng dẫn & Câu trả lời
            </h2>
            <div className="mt-3 h-1 bg-gradient-to-r from-[var(--accent-secondary)] via-[var(--accent-secondary)] to-transparent mx-auto w-32" />
          </div>
          <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] sm:text-base leading-relaxed">
            Tìm câu trả lời nhanh cho những câu hỏi phổ biến nhất
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="mx-auto max-w-3xl space-y-3">
          {(faqs?.length ? faqs : DEFAULT_FAQS).map((f, idx) => (
            <motion.div
              key={f.q + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Item
                title={f.q}
                body={f.a}
                open={openIndex === idx}
                onToggle={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Box — dùng dữ liệu thật */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)] to-blue-700 p-10 sm:p-12 text-white text-center shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-2xl font-black sm:text-3xl tracking-tight">Vẫn còn câu hỏi?</h3>
          <p className="mt-3 text-sm font-medium opacity-95 leading-relaxed">
            Liên hệ {orgName} tại{" "}
            <a href={`mailto:${email}`} className="font-extrabold underline underline-offset-2">{email}</a>
            {contactPhone && (
              <> hoặc gọi hotline <span className="font-extrabold">{phone}</span></>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
