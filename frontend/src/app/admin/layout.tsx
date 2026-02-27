import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans text-neutral-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto p-8 bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
