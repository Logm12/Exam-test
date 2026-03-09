import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetcher } from "@/lib/api";
import AdminDashboardClient from "./AdminDashboardClient";

async function getAdminMetrics(examId: number = 1) {
    try {
        const metrics = await fetcher(`/admin/exams/${examId}/metrics`);
        return metrics;
    } catch (error) {
        console.error("Failed to fetch admin metrics:", error);
        return { total_submissions: 0, average_score: 0, high_violations: [], accuracy_rate: 0 };
    }
}

async function getRecentExams() {
    try {
        const exams = await fetcher(`/exams/`);
        return exams || [];
    } catch (error) {
        return [];
    }
}

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/admin/login");
    }

    // @ts-ignore
    if (session?.user?.role !== "admin") {
        redirect("/");
    }

    const exams = await getRecentExams();
    let metrics = { total_submissions: 0, average_score: 0, high_violations: [], accuracy_rate: 0 };

    if (exams && exams.length > 0) {
        metrics = await getAdminMetrics(exams[0].id);
    }

    return <AdminDashboardClient metrics={metrics} exams={exams} />;
}
