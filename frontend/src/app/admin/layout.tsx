import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden font-sans" style={{ background: '#F5F6F8' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
