import React from 'react';

interface FdbLogoProps {
    className?: string; // Passed to the outermost container, e.g., sizing "text-xl", "text-4xl"
    withWrapper?: boolean; // If true, adds the white background card
    withVnuLogo?: boolean; // Deprecated (kept for backward compatibility)
}

export default function FdbLogo({ className = 'text-5xl', withWrapper = false }: FdbLogoProps) {
    const content = (
        <div className="flex items-center leading-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/logofdb.jpeg"
                alt="FDB Talent"
                style={{ height: '1.5em', width: 'auto' }}
                className="block"
            />
        </div>
    );

    if (withWrapper) {
        return (
            <div className={`inline-flex items-center bg-white p-[0.4em] rounded-[0.2em] shadow-sm ${className}`}>
                {content}
            </div>
        );
    }

    return <div className={`inline-flex items-center ${className}`}>{content}</div>;
}
