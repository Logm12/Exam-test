import Navbar from "@/components/legal-contest/Navbar";
import Hero from "@/components/legal-contest/Hero";
import Intro from "@/components/legal-contest/Intro";
import Countdown from "@/components/legal-contest/Countdown";
import CTA from "@/components/legal-contest/CTA";
import Highlights from "@/components/legal-contest/Highlights";
import Rules from "@/components/legal-contest/Rules";
import FAQ from "@/components/legal-contest/FAQ";
import Footer from "@/components/legal-contest/Footer";

import { contactInfo } from "@/components/legal-contest/data";

export interface ExamLandingData {
  id: number;
  title: string;
  description: string;
  slug: string;
  cover_image: string;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  is_published: boolean;
  theme_config?: any;
  landing_config?: {
    poster_image?: string;
    organizer_name?: string;
    organizer_logo?: string;
    organizer_description?: string;
    rules?: string;
    guide?: string;
  };
}

export default function LegalContestLandingPage({ exam }: { exam: ExamLandingData }) {
  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <Navbar />
      <main>
        <Hero exam={exam} />
        <Intro />
        <Countdown endTime={exam.end_time || ""} />
        <Highlights guide={exam.landing_config?.guide} />
        <CTA organizerName={exam.landing_config?.organizer_name} organizerDesc={exam.landing_config?.organizer_description} organizerLogo={exam.landing_config?.organizer_logo} />
        <Rules rulesContent={exam.landing_config?.rules} />
        <FAQ />
      </main>
      <Footer info={contactInfo} organizerName={exam.landing_config?.organizer_name} />
    </div>
  );
}
