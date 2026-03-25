import type { ContactInfo } from "@/components/legal-contest/types";

export default function Footer({ info }: { info: ContactInfo }) {
  return (
    <footer id="contact" className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl text-sm text-[var(--text-muted)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">Ban tổ chức</div>
            <div className="mt-3 space-y-1.5 font-semibold text-[var(--text-secondary)]">
              <div>{info.organizerName}</div>
              <div>{info.address}</div>
              <div>Điện thoại: {info.phone}</div>
              <div>Email: {info.email}</div>
            </div>
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">Đơn vị lập trình</div>
            <div className="mt-3 space-y-1.5 font-semibold text-[var(--text-secondary)]">
              <div>{info.devName}</div>
              <div>{info.devCompany}</div>
              <a href={info.moreLinkHref} className="inline-flex hover:text-[var(--accent-primary)] hover:underline">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-sm text-[var(--text-muted)] sm:flex-row">
          <div>&copy; {new Date().getFullYear()} Cuộc thi Tìm hiểu Pháp luật. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-[var(--accent-primary)]" href="#home">
              Trang chủ
            </a>
            <a className="hover:text-[var(--accent-primary)]" href="#rules">
              Thể lệ
            </a>
            <a className="hover:text-[var(--accent-primary)]" href="#leaderboard">
              Bảng xếp hạng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
