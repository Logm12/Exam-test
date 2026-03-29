"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface CTAProps {
  organizerName?: string;
  organizerDesc?: string;
  organizerLogo?: string;
  organizers?: { name: string; logo?: string; desc?: string }[];
}

export default function CTA({ organizerName, organizerDesc, organizerLogo, organizers }: CTAProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
  const defaultLogoUrl = organizerLogo 
    ? (organizerLogo.startsWith("http") ? organizerLogo : `${backendBase}${organizerLogo}`)
    : "/logo1.jpeg";
  
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Tính toán cuộn khoảng 1 card (~450px + gap) hoặc clientWidth nếu nhỏ hơn màn hình
      const scrollAmount = Math.min(scrollRef.current.clientWidth, 480);
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const cards: any[] = [];
  if (organizers && organizers.length > 0) {
    organizers.forEach((org) => {
       const orgLogoUrl = org.logo ? (org.logo.startsWith("http") ? org.logo : `${backendBase}${org.logo}`) : "";
       cards.push({
          logo: orgLogoUrl,
          name: org.name || "Đơn vị tổ chức",
          desc: org.desc || "",
          isHardcodedVnu: false,
          isHardcodedDoan: false,
       });
    });
  } else {
    cards.push({
       logo: defaultLogoUrl,
       name: organizerName || "Trường Quốc Tế - Đại học Quốc gia Hà Nội",
       desc: organizerDesc || "",
       isHardcodedVnu: !organizerDesc,
       isHardcodedDoan: false,
    });
  }

  // Luôn nạp Đoàn Trường Quốc tế
  cards.push({
    logo: "/logo2.jpeg",
    name: "Đoàn Trường Quốc tế - ĐHQGHN.",
    desc: "",
    isHardcodedVnu: false,
    isHardcodedDoan: true,
  });
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
            {organizerName || "Ban Tổ Chức Cuộc Thi Tìm Hiểu Pháp Luật 2025"}
          </h2>
          <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] sm:text-base leading-relaxed">
            Đơn vị chỉ đạo &amp; Tổ chức
          </p>
        </motion.div>

        {/* Content */}
        <div className="mt-12 relative w-full group">
          {cards.length > 2 && (
            <>
              <button 
                onClick={() => scroll("left")} 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-[var(--border-default)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={() => scroll("right")} 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-[var(--border-default)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </>
          )}

          <div 
            ref={scrollRef}
            className={`flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 pb-8 ${cards.length <= 2 ? 'lg:grid lg:grid-cols-2 lg:overflow-visible' : ''}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[420px] lg:w-[45vw] lg:max-w-[480px] surface-card rounded-2xl border border-[var(--border-default)] p-8 sm:p-10 shadow-md hover:shadow-xl transition-all duration-300 snap-center mx-auto ${cards.length <= 2 ? 'w-full lg:w-full lg:max-w-none snapshot-disabled' : ''}`}
                style={cards.length <= 2 ? { flexShrink: 1 } : {}}
              >
                <div className="border-l-4 border-[var(--accent-secondary)] pl-5 h-full flex flex-col justify-start">
                  <div className="text-center">
                    {card.logo && (
                      <div className="mx-auto mb-5">
                        <div className="relative mx-auto h-20 w-full max-w-[200px] sm:h-24">
                          <img
                            src={card.logo}
                            alt={card.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl font-black text-[var(--text-primary)] sm:text-2xl">
                      {card.name}
                    </h3>
                  </div>
                  
                  <div className="flex-1 mt-4">
                    {card.isHardcodedVnu && (
                      <>
                        <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                          Trường Quốc tế trực thuộc Đại học Quốc gia Hà Nội là trung tâm đào tạo, nghiên cứu và đổi mới sáng tạo tiên phong, đạt chuẩn kiểm định quốc tế. Với 100% chương trình giảng dạy bằng ngoại ngữ, VNU-IS tự hào là "Hub" giáo dục đa văn hóa, chuyên cung cấp nguồn nhân lực chất lượng cao, đáp ứng các tiêu chuẩn khắt khe nhất của thị trường lao động toàn cầu.
                        </p>
                        <p className="mt-4 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                          Bản sắc của Trường được đúc kết qua triết lý định danh I-S:
                        </p>

                        <div className="mt-5 w-full">
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">I</p>
                              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                                Innovation - Interdisciplinarity - Internationalization - Integration
                              </p>
                              <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                Đổi mới - Liên ngành - Quốc tế hóa - Hội nhập.
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">S</p>
                              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                                Start-up - Self-Study - Sustainability - Self-worth
                              </p>
                              <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                                Khởi nghiệp - Tự học - Bền vững - Khẳng định giá trị bản thân.
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                          Mang sứ mệnh kiến tạo một môi trường tự do học thuật và chuyển giao tri thức liên ngành, VNU-IS luôn kiên định với 5 giá trị cốt lõi: Chất lượng cao – Sáng tạo – Tiên phong – Trách nhiệm – Hội nhập quốc tế.
                        </p>
                      </>
                    )}

                    {card.isHardcodedDoan && (
                      <>
                        <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                          Đoàn TNCS Hồ Chí Minh Trường Quốc tế được thành lập với mục tiêu khẳng định vị trí quan trọng, tiên phong của tổ chức Đoàn thanh niên trong việc phát huy truyền thống, dẫn dắt phong trào trở thành một trong những đơn vị dẫn đầu trong phong trào Đoàn ĐHQGHN. Đoàn TNCS Hồ Chí Minh Trường Quốc tế coi trọng việc giáo dục chính trị, tư tưởng, rèn luyện nhân cách cho đoàn viên, sinh viên. Bên cạnh đó, gắn các hoạt động của Đoàn với nhiệm vụ trọng tâm của Trường và của Đoàn ĐHQGHN.
                        </p>
                        <div className="mt-8 h-px bg-[var(--border-default)] w-full" />
                        <p className="mt-6 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                          Đơn vị chỉ đạo &amp; Tổ chức: {organizerName || "Trường Quốc Tế - Đại học Quốc gia Hà Nội • Đoàn Trường Quốc tế - ĐHQGHN."}
                        </p>
                      </>
                    )}

                    {!card.isHardcodedVnu && !card.isHardcodedDoan && card.desc && (
                      <div 
                        className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: card.desc }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
