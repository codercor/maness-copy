"use client";

import type { Translations, Package } from "@/types";

interface MiniSummaryProps {
    copy: Translations;
    localizedPackage: Package;
    currentPackage: Package;
    onBookClick: () => void;
}

export function MiniSummary({
    copy,
    localizedPackage,
    currentPackage,
    onBookClick,
}: MiniSummaryProps) {
    return (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl rounded-full bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_20px_50px_rgba(11,31,58,0.2)] md:left-1/2 md:right-auto md:-translate-x-1/2">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">
                        {copy.miniSummary.label}
                    </p>
                    <p className="font-semibold text-[var(--navy)]">
                        {localizedPackage.name}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">{copy.miniSummary.from}</p>
                    <p className="text-lg font-bold text-[var(--navy)]">
                        {currentPackage.destination.price}
                    </p>
                </div>
                <button
                    className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/30"
                    onClick={onBookClick}
                >
                    {copy.booking.bookNow}
                </button>
            </div>
        </div>
    );
}
