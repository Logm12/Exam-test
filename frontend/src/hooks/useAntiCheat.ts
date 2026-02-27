"use client";

import { useEffect, useState } from "react";

interface AntiCheatOptions {
    requireFullscreen?: boolean;
    disableContextMenu?: boolean;
    disableCopyPaste?: boolean;
    disableShortcuts?: boolean;
}

export function useAntiCheat({
    requireFullscreen = true,
    disableContextMenu = true,
    disableCopyPaste = true,
    disableShortcuts = true,
}: AntiCheatOptions = {}) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violationCount, setViolationCount] = useState(0);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if (disableContextMenu) {
                e.preventDefault();
                setViolationCount((c) => c + 1);
            }
        };

        const handleCopyPaste = (e: ClipboardEvent) => {
            if (disableCopyPaste) {
                e.preventDefault();
                setViolationCount((c) => c + 1);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (disableShortcuts) {
                // Block Ctrl/Cmd + combinations (except specific allowed ones if needed)
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    setViolationCount((c) => c + 1);
                }

                // Block Alt/Option combinations (prevent tab switching shortcuts)
                if (e.altKey && e.key === "Tab") {
                    e.preventDefault();
                    setViolationCount((c) => c + 1);
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setViolationCount((c) => c + 1);
                console.warn("Visibility lost - Potential cheating detected");
            }
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        // Attach Event Listeners
        if (disableContextMenu) document.addEventListener("contextmenu", handleContextMenu);
        if (disableCopyPaste) {
            document.addEventListener("copy", handleCopyPaste);
            document.addEventListener("paste", handleCopyPaste);
            document.addEventListener("cut", handleCopyPaste);
        }
        if (disableShortcuts) document.addEventListener("keydown", handleKeyDown);

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("copy", handleCopyPaste);
            document.removeEventListener("paste", handleCopyPaste);
            document.removeEventListener("cut", handleCopyPaste);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [disableContextMenu, disableCopyPaste, disableShortcuts]);

    const requestFullscreen = async () => {
        if (requireFullscreen && !document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
            }
        }
    };

    return {
        isFullscreen,
        violationCount,
        requestFullscreen,
    };
}
