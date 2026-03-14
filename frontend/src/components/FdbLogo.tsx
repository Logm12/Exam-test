import React from 'react';

interface FdbLogoProps {
    className?: string; // Passed to the outermost container, e.g., sizing "text-xl", "text-4xl"
    withWrapper?: boolean; // If true, adds the white background card
    withVnuLogo?: boolean; // Add VNU label to the left
}

export default function FdbLogo({ className = 'text-5xl', withWrapper = false, withVnuLogo = true }: FdbLogoProps) {
    const content = (
        <div className="flex items-center gap-[0.5em] leading-none">
            {withVnuLogo && (
                <div className="flex items-center gap-[0.5em]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/VNU_IS_logo_(2).png" alt="VNU IS" style={{ height: '1.5em', width: 'auto' }} className="flex-shrink-0" />
                    <div className="w-[1px] h-[1.3em] bg-[#1e3a8a]/20 dark:bg-slate-600 flex-shrink-0" />
                </div>
            )}
            <div className="flex items-center">
                <div className="bg-[#1e3a8a] text-white px-[0.6em] py-[0.25em] box-cut shadow-lg f-jakarta-extra">
                    FDB
                </div>
                <div className="text-[#1e3a8a] tracking-[0.2em] f-inter-light uppercase">
                    Talent
                </div>
            </div>
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
