"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Translations, PackageDetails, PackageId, DestinationContentTranslation } from "@/types";

interface DestinationsSectionProps {
    copy: Translations;
    packages: PackageDetails;
    selectedPackage: PackageId;
    setSelectedPackage: (id: PackageId) => void;
    getDestinationText: (packageId: string) => DestinationContentTranslation | null;
    carouselRef: React.RefObject<HTMLDivElement | null>;
    carouselState: { canPrev: boolean; canNext: boolean };
    scrollCarousel: (direction: "next" | "prev") => void;
    updateCarouselState: () => void;
    motionEnabled: boolean;
}

const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: motionEase },
    },
};

export function DestinationsSection({
    copy,
    packages,
    selectedPackage,
    setSelectedPackage,
    getDestinationText,
    carouselRef,
    carouselState,
    scrollCarousel,
    updateCarouselState,
    motionEnabled,
}: DestinationsSectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    // Filter to only show packages with showOnHomepage enabled
    const packageIds = useMemo(() => {
        return (Object.keys(packages) as PackageId[]).filter(
            (id) => packages[id]?.showOnHomepage !== false
        );
    }, [packages]);

    return (
        <section className="sunset-wash py-24 scroll-mt-24 snap-start" id="destinations">
            <div className="mx-auto w-[min(1200px,92vw)]">
                <motion.div
                    className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                    {...sectionHeaderMotion}
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="header-symbol">
                                <span className="material-symbols-outlined text-sm text-white">
                                    explore
                                </span>
                            </span>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                                {copy.destinations.label}
                            </p>
                        </div>
                        <h2 className="display-title mt-4 text-3xl font-bold md:text-4xl">
                            {copy.destinations.title}
                        </h2>
                        <div className="section-rule mt-4" />
                        <svg className="section-motif" viewBox="0 0 160 18" aria-hidden="true">
                            <path d="M0 10 C 20 4, 40 4, 60 10 S 100 16, 120 10 S 150 4, 160 10" />
                        </svg>
                    </div>
                    <Link className="text-sm font-bold text-[var(--navy)]" href="/packages">
                        {copy.destinations.viewAll}
                    </Link>
                </motion.div>
                <div className="flex items-center gap-4 reveal" data-reveal>
                    <button
                        className="hidden h-11 w-11 place-items-center rounded-full border border-black/10 bg-white transition disabled:opacity-40 md:grid"
                        onClick={() => scrollCarousel("prev")}
                        disabled={!carouselState.canPrev}
                        aria-label="Previous"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <div
                        ref={carouselRef}
                        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-4 px-1 snap-x snap-mandatory"
                        onScroll={updateCarouselState}
                    >
                        {packageIds.map((packageId) => {
                            const pkg = packages[packageId];
                            const destinationText = getDestinationText(packageId);
                            return (
                                <article
                                    key={packageId}
                                    className={`group lux-card min-w-[280px] max-w-[320px] flex-1 shrink-0 snap-start overflow-hidden rounded-3xl bg-white ${selectedPackage === packageId
                                        ? "card-glow ring-1 ring-[var(--gold)] shadow-[0_25px_60px_rgba(11,31,58,0.2)]"
                                        : ""
                                        }`}
                                >
                                    <div className="curtain-reveal relative h-56 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${pkg.image || pkg.destination?.image || ''})` }}
                                        />
                                        {pkg.isSelected && (
                                            <span className="absolute left-4 top-4 lux-badge lux-badge--gold">
                                                {copy.destinations.selected}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                                                {copy.destinations.quickLook}
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {destinationText?.quickLook ?? pkg.destination?.quickLook ?? ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="material-symbols-outlined text-base">
                                                calendar_month
                                            </span>
                                            {pkg.dates || pkg.destination?.dates || ''}
                                        </p>
                                        <h3 className="mt-2 text-lg font-bold">
                                            {destinationText?.title ?? pkg.destination?.title ?? pkg.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {copy.destinations.description}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-400 md:hidden">
                                            {destinationText?.quickLook ?? pkg.destination?.quickLook ?? ''}
                                        </p>
                                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div>
                                                <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                                                    {copy.destinations.startingAt}
                                                </span>
                                                <strong className="text-lg text-[var(--navy)]">
                                                    {pkg.price || pkg.destination?.price || ''}
                                                </strong>
                                            </div>
                                            <Link
                                                href={`/packages/${packageId}`}
                                                className="rounded-full border-2 border-[var(--navy)] px-4 py-2 text-xs font-bold text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors"
                                            >
                                                {copy.destinations.viewPlan}
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    <button
                        className="hidden h-11 w-11 place-items-center rounded-full border border-black/10 bg-white transition disabled:opacity-40 md:grid"
                        onClick={() => scrollCarousel("next")}
                        disabled={!carouselState.canNext}
                        aria-label="Next"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
                    <button
                        className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white transition disabled:opacity-40"
                        onClick={() => scrollCarousel("prev")}
                        disabled={!carouselState.canPrev}
                        aria-label="Previous"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <button
                        className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white transition disabled:opacity-40"
                        onClick={() => scrollCarousel("next")}
                        disabled={!carouselState.canNext}
                        aria-label="Next"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
