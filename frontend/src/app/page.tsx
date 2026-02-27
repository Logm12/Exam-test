import { LanguageProvider } from "@/contexts/LanguageContext";
import LandingPage from "@/app/landing/page";

export default function HomePage() {
  return (
    <LanguageProvider>
      <LandingPage />
    </LanguageProvider>
  );
}
