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

export default function LegalContestLandingPage() {
  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Countdown />
        <Highlights />
        <CTA />
        <Rules />
        <FAQ />
      </main>
      <Footer info={contactInfo} />
    </div>
  );
}
