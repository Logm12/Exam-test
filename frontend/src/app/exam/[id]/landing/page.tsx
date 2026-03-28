import { fetcher } from "@/lib/api";
import LegalContestLandingPage from "@/components/legal-contest/LegalContestLandingPage";
import { notFound } from "next/navigation";

export default async function ExamLanding({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const examData = await fetcher(`/exams/${id}/landing`);
        return <LegalContestLandingPage exam={examData} />;
    } catch (error) {
        console.error("Error fetching landing data", error);
        return notFound();
    }
}
