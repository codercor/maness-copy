"use client";

import Link from "next/link";
import { type GalleryItem, type Language } from "@/types";
import { useTranslationContext } from "@/context/TranslationContext";

interface DestinationCardProps {
    item: GalleryItem;
    // Optional override for height class to enable masonry layout
    heightClass?: string;
}

export function DestinationCard({ item, heightClass = "h-80" }: DestinationCardProps) {
    const { t, language } = useTranslationContext();

    // Get translated content based on current language, fallback to English then legacy fields
    const translations = item.translations?.[language as keyof typeof item.translations] || item.translations?.en;
    const title = translations?.title || item.title;
    const description = translations?.description || item.description;
    const quickLook = translations?.quickLook || item.quickLook;

    // Determine destination link: use _id if available (standard), otherwise fallback
    const destinationLink = item._id ? `/destinations/${item._id}` : `#`;

    return (
        <article className="gallery-card lux-card group overflow-hidden rounded-3xl bg-white mb-6 break-inside-avoid shadow-sm hover:shadow-lg transition-shadow">
            <div className={`curtain-reveal relative ${heightClass} overflow-hidden`}>
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                        {t.destinationCard.quickLook}
                    </p>
                    <p className="text-sm font-semibold">
                        {quickLook}
                    </p>
                </div>
            </div>
            <div className="p-6">
                <span className="lux-badge lux-badge--navy inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {item.duration}
                </span>

                <h3 className="mt-3 text-xl font-bold text-[var(--navy)]">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    {description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                    {item.featured && (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--gold)] font-semibold">
                            <span className="material-symbols-outlined text-sm">star</span>
                            {t.destinationCard.featured}
                        </span>
                    )}

                    <Link
                        href={destinationLink}
                        className={`gallery-cta rounded-full px-4 py-2 text-xs font-bold ml-auto ${item.featured
                            ? "gallery-cta--featured bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] text-white shadow-lg shadow-blue-500/30"
                            : "border border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors"
                            }`}
                    >
                        {t.destinationCard.viewDetails}
                    </Link>
                </div>
            </div>
        </article>
    );
}
