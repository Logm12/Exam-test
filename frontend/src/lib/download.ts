import { getSession } from "next-auth/react";

function getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    // e.g. attachment; filename=foo.csv
    const match = /filename\*=UTF-8''([^;]+)|filename=([^;]+)/i.exec(contentDisposition);
    const filename = decodeURIComponent((match?.[1] || match?.[2] || "").trim().replace(/^"|"$/g, ""));
    return filename || null;
}

export async function downloadFromApi(
    url: string,
    fallbackFilename: string,
): Promise<void> {
    const session = await getSession();
    const token = (session as any)?.accessToken as string | undefined;
    if (!token) {
        throw new Error("Missing access token. Please log in again.");
    }

    const resp = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(text || `Download failed (${resp.status})`);
    }

    const blob = await resp.blob();
    const filename = getFilenameFromContentDisposition(resp.headers.get("content-disposition")) || fallbackFilename;
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(objectUrl);
}
