import Navbar from "@/components/legal-contest/Navbar";
import Hero from "@/components/legal-contest/Hero";
import Intro from "@/components/legal-contest/Intro";
import Countdown from "@/components/legal-contest/Countdown";
import CTA from "@/components/legal-contest/CTA";
import Highlights from "@/components/legal-contest/Highlights";
import Rules from "@/components/legal-contest/Rules";
import FAQ from "@/components/legal-contest/FAQ";
import Footer from "@/components/legal-contest/Footer";
import { contestInfo } from "@/components/legal-contest/data";

export interface LandingConfig {
  poster_image?: string;
  organizer_name?: string;
  organizer_logo?: string;
  organizer_description?: string;
  rules?: string;
  guide?: string;
  slogan?: string;
  contact_email?: string;
  contact_phone?: string;
  faqs?: { q: string; a: string }[];
  organizers?: { name: string; logo?: string; desc?: string }[];
}

export interface ExamLandingData {
  id: number;
  title: string;
  description?: string;
  slug: string;
  cover_image?: string;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  is_published: boolean;
  theme_config?: any;
  landing_config?: LandingConfig;
}

export default function LegalContestLandingPage({ exam }: { exam: ExamLandingData }) {
  const lc = exam.landing_config;
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar examTitle={exam.title} />
      <main>
        <Hero exam={exam} />
        <Intro slogan={lc?.slogan || contestInfo.intro} />
        <Countdown endTime={exam.end_time || ""} />
        <Highlights guide={lc?.guide} />
        <CTA
          organizerName={lc?.organizer_name}
          organizerDesc={lc?.organizer_description}
          organizerLogo={lc?.organizer_logo}
          organizers={lc?.organizers}
        />
        <Rules rulesContent={lc?.rules} />
        <FAQ
          contactEmail={lc?.contact_email}
          contactPhone={lc?.contact_phone}
          organizerName={lc?.organizer_name}
          faqs={lc?.faqs}
        />
      </main>
      <Footer
        organizerName={lc?.organizer_name}
        contactEmail={lc?.contact_email}
        contactPhone={lc?.contact_phone}
      />
    </div>
  );
}
