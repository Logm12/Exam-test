interface FooterProps {
  organizerName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function Footer({ organizerName, contactEmail, contactPhone }: FooterProps) {
  const orgName = organizerName || "Ban Tổ Chức";
  const email = contactEmail;
  const phone = contactPhone;

  return (
    <footer id="contact" className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl text-sm text-[var(--text-muted)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">Ban tổ chức</div>
            <div className="mt-3 space-y-1.5 font-semibold text-[var(--text-secondary)]">
              <div>{orgName}</div>
              {phone && <div>Điện thoại: {phone}</div>}
              {email && <div>Email: <a href={`mailto:${email}`} className="hover:text-[var(--accent-primary)]">{email}</a></div>}
            </div>
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            <div className="text-sm font-bold text-[var(--text-primary)]">Nền tảng</div>
            <div className="mt-3 space-y-1.5 font-semibold text-[var(--text-secondary)]">
              <div>ExamOS Platform</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-sm text-[var(--text-muted)] sm:flex-row">
          <div>&copy; {new Date().getFullYear()} {orgName}. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-[var(--accent-primary)]" href="#home">Trang chủ</a>
            <a className="hover:text-[var(--accent-primary)]" href="#rules">Thể lệ</a>
            <a className="hover:text-[var(--accent-primary)]" href="#faq">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
