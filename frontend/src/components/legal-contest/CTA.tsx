"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CTA() {
  return (
    <section id="join" className="relative overflow-hidden bg-[var(--bg-secondary)] py-16 sm:py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[var(--accent-secondary)] opacity-5 blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-[var(--accent-primary)] opacity-5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-secondary)]">
            Ban tổ chức
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Ban Tổ Chức Cuộc Thi Tìm Hiểu Pháp Luật 2025
          </h2>
          <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] sm:text-base leading-relaxed">
            Đơn vị chỉ đạo &amp; Tổ chức
          </p>
        </motion.div>

        {/* Content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-2xl border border-[var(--border-default)] p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="border-l-4 border-[var(--accent-secondary)] pl-5">
              <div className="text-center">
                <div className="mx-auto mb-5">
                  <div className="relative mx-auto h-14 w-full max-w-xl sm:h-16">
                    <Image
                      src="/logo1.jpeg"
                      alt="Logo Trường Quốc Tế - ĐHQGHN"
                      fill
                      sizes="(max-width: 640px) 90vw, 576px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-black text-[var(--text-primary)] sm:text-2xl">
                  Trường Quốc Tế - Đại học Quốc gia Hà Nội
                </h3>
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                Trường Quốc tế trực thuộc Đại học Quốc gia Hà Nội là trung tâm đào tạo, nghiên cứu và đổi mới sáng tạo tiên phong, đạt chuẩn kiểm định quốc tế. Với 100% chương trình giảng dạy bằng ngoại ngữ, VNU-IS tự hào là "Hub" giáo dục đa văn hóa, chuyên cung cấp nguồn nhân lực chất lượng cao, đáp ứng các tiêu chuẩn khắt khe nhất của thị trường lao động toàn cầu.
              </p>
              <p className="mt-4 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                Bản sắc của Trường được đúc kết qua triết lý định danh I-S:
              </p>

              <div className="mt-5 w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">
                      I
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                      Innovation - Interdisciplinarity - Internationalization - Integration
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                      Đổi mới - Liên ngành - Quốc tế hóa - Hội nhập.
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">
                      S
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                      Start-up - Self-Study - Sustainability - Self-worth
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                      Khởi nghiệp - Tự học - Bền vững - Khẳng định giá trị bản thân.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                Mang sứ mệnh kiến tạo một môi trường tự do học thuật và chuyển giao tri thức liên ngành, VNU-IS luôn kiên định với 5 giá trị cốt lõi: Chất lượng cao – Sáng tạo – Tiên phong – Trách nhiệm – Hội nhập quốc tế.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-2xl border border-[var(--border-default)] p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="border-l-4 border-[var(--accent-secondary)] pl-5">
              <div className="text-center">
                <div className="mx-auto mb-5">
                  <div className="relative mx-auto h-14 w-full max-w-xl sm:h-16">
                    <Image
                      src="/logo2.jpeg"
                      alt="Logo Đoàn Trường Quốc tế - ĐHQGHN"
                      fill
                      sizes="(max-width: 640px) 90vw, 576px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-black text-[var(--text-primary)] sm:text-2xl">
                  Đoàn Trường Quốc tế - ĐHQGHN.
                </h3>
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                Đoàn TNCS Hồ Chí Minh Trường Quốc tế được thành lập với mục tiêu khẳng định vị trí quan trọng, tiên phong của tổ chức Đoàn thanh niên trong việc phát huy truyền thống, dẫn dắt phong trào trở thành một trong những đơn vị dẫn đầu trong phong trào Đoàn ĐHQGHN. Đoàn TNCS Hồ Chí Minh Trường Quốc tế coi trọng việc giáo dục chính trị, tư tưởng, rèn luyện nhân cách cho đoàn viên, sinh viên. Bên cạnh đó, gắn các hoạt động của Đoàn với nhiệm vụ trọng tâm của Trường và của Đoàn ĐHQGHN.
              </p>
            </div>

            <div className="mt-8 h-px bg-[var(--border-default)]" />

            <p className="mt-6 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
              Đơn vị chỉ đạo &amp; Tổ chức: Trường Quốc Tế - Đại học Quốc gia Hà Nội • Đoàn Trường Quốc tế - ĐHQGHN.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
