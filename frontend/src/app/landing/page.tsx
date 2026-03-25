import type { Metadata } from "next";
import LegalContestLandingPage from "@/components/legal-contest/LegalContestLandingPage";

export const metadata: Metadata = {
  title: "Cuộc thi tìm hiểu pháp luật 2025",
  description: "Landing page cuộc thi trắc nghiệm trực tuyến (pháp luật) — hiện đại, tối giản, mobile-first.",
};

export default function LandingPage() {
  return <LegalContestLandingPage />;
}
