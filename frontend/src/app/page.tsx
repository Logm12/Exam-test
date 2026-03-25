import { LanguageProvider } from "@/contexts/LanguageContext";
import LegacyLandingPage from "@/components/examos/LegacyLandingPage";

export default function HomePage() {
  return (
    <LanguageProvider>
      <LegacyLandingPage />
    </LanguageProvider>
  );
}
