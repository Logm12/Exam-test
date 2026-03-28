import type { Metadata } from "next";
import LegalContestLandingPage from "@/components/legal-contest/LegalContestLandingPage";

export const metadata: Metadata = {
  title: "Cuộc thi tìm hiểu pháp luật 2025",
  description: "Landing page cuộc thi trắc nghiệm trực tuyến (pháp luật) — hiện đại, tối giản, mobile-first.",
};

import { redirect } from "next/navigation";

export default function LandingPage() {
  redirect("/exam/1/landing");
}
