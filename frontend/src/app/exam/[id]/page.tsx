import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetcher } from "@/lib/api";
import ExamGatewayClient from "./ExamGatewayClient";

type Exam = {
    id: number;
    title: string;
    duration: number;
    start_time: string;
    is_published: boolean;
};

async function getExamDetails(id: string) {
    try {
        const exam: Exam = await fetcher(`/exams/${id}`);
        if (!exam.is_published) {
            return null;
        }
        return exam;
    } catch (error) {
        console.error("Failed to fetch exam:", error);
        return null;
    }
}

export default async function PreExamGateway({ params }: { params: Promise<{ id: string }> }) {
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

    return <ExamGatewayClient exam={exam} examId={id} />;
}
