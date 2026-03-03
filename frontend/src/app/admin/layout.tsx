import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans text-[var(--text-primary)] transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto p-8" style={{ background: 'var(--bg-tertiary)' }}>
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
