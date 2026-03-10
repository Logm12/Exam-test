import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientHelpPage from "./ClientHelpPage";

export default async function HelpPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return <ClientHelpPage userName={session.user?.name || "Student"} />;
}
