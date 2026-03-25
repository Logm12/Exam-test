import { contestInfo } from "@/components/legal-contest/data";

export default function Intro() {
  return (
    <section className="bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <p className="mx-auto max-w-3xl text-pretty text-base font-semibold text-[var(--text-secondary)] sm:text-lg">
          {contestInfo.intro}
        </p>
      </div>
    </section>
  );
}
