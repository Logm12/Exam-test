import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetcher } from "@/lib/api";
import ReceiptClient from "./ReceiptClient";

type Exam = {
    id: number;
    title: string;
};

async function getExamDetails(id: string) {
    try {
        const exam: Exam = await fetcher(`/exams/${id}`);
        return exam;
    } catch (error) {
        return null;
    }
}

export default async function SubmissionReceipt({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // @ts-ignore: NextAuth types do not include role by default
    if (session?.user?.role === "admin") {
        redirect("/admin");
    }

    const { id } = await params;
    const exam = await getExamDetails(id);

    return <ReceiptClient exam={exam} examId={id} />;
}
