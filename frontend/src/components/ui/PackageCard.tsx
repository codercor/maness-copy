"use client";

import Link from "next/link";
import type { Package, Language } from "@/types";
import { useTranslationContext } from "@/context/TranslationContext";

interface PackageCardProps {
    pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
    const { t, language } = useTranslationContext();

    const price = pkg.price || pkg.destination?.price || "Price TBD";
    const dates = pkg.dates || pkg.destination?.dates || "";

    // Use translations based on current language, fallback to English
    const translations = pkg.translations?.[language as keyof typeof pkg.translations] || pkg.translations?.en;
    const title = translations?.title || pkg.destination?.title || pkg.name;
    const quickLook = translations?.quickLook || pkg.destination?.quickLook || "";

    // Use the package image if available, otherwise fallback to destination image
    const image = pkg.image || pkg.destination?.image || "";

    return (
        <article className="group lux-card rounded-3xl bg-white overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
            {/* Image */}
            <div className="relative h-48 overflow-hidden flex-shrink-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Spots Badge */}
                {pkg.spots && pkg.spots < 5 && (
                    <span className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                        {t.packageCard.spotsLeft.replace("{spots}", String(pkg.spots))}
                    </span>
                )}

                {/* Selected/Featured Badge */}
                {pkg.isSelected && (
                    <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-white shadow-md">
                        {t.packageCard.selectedPackage}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    {dates}
                </p>

                <h3 className="text-lg font-bold text-[var(--navy)] mb-2 line-clamp-2">
                    {title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                    {quickLook}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">{t.packageCard.startingAt}</p>
                        <p className="text-xl font-bold text-[var(--navy)]">{price}</p>
                    </div>

                    <Link
                        href={`/packages/${pkg.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
                    >
                        {t.packageCard.viewPackage}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </article >
    );
}
