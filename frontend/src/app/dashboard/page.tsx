import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetcher } from "@/lib/api";
import StudentDashboardClient from "./StudentDashboardClient";

type Exam = {
    id: number;
    title: string;
    duration: number;
    start_time: string;
    is_published: boolean;
};

async function getStudentExams() {
    try {
        const exams: Exam[] = await fetcher("/exams/me");
        return exams;
    } catch (error) {
        console.error("Failed to fetch student exams:", error);
        return [];
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // @ts-ignore
    if (session.user?.role === "admin") {
        redirect("/admin");
    }

    const availableExams = await getStudentExams();

    return (
        <StudentDashboardClient
            exams={availableExams}
            userName={session.user?.name || "Student"}
        />
    );
}
