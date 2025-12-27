"use client";

import { motion, type Variants } from "framer-motion";
import type { Translations, OfferCard } from "@/types";

interface OffersSectionProps {
    copy: Translations;
    offersCards: OfferCard[];
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

const cardIcons = ["celebration", "checkroom", "security"];

export function OffersSection({ copy, offersCards, motionEnabled }: OffersSectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    return (
        <section className="coast-pattern py-24 scroll-mt-24 snap-start" id="offers">
            <div className="mx-auto w-[min(1200px,92vw)]">
                <motion.div className="mb-10" {...sectionHeaderMotion}>
                    <div className="flex items-center gap-3">
                        <span className="header-symbol">
                            <span className="material-symbols-outlined text-sm text-white">
                                sailing
                            </span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            {copy.offers.label}
                        </p>
                    </div>
                    <h2 className="display-title mt-4 text-3xl font-bold md:text-4xl">
                        {copy.offers.title}
                    </h2>
                    <div className="section-rule mt-4" />
                    <svg className="section-motif" viewBox="0 0 160 18" aria-hidden="true">
                        <path d="M0 10 C 20 4, 40 4, 60 10 S 100 16, 120 10 S 150 4, 160 10" />
                    </svg>
                    <p className="mt-2 text-slate-500">
                        {copy.offers.subtitle}
                    </p>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-3">
                    {offersCards.map((card, index) => (
                        <article
                            key={card.title}
                            data-reveal
                            className={`reveal lux-card rounded-3xl bg-white p-8 transition hover:-translate-y-1 ${index === 0
                                    ? "reveal-delay-1"
                                    : index === 1
                                        ? "reveal-delay-2"
                                        : "reveal-delay-3"
                                }`}
                        >
                            <span className="material-symbols-outlined text-3xl text-[var(--navy)]">
                                {cardIcons[index]}
                            </span>
                            <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
                            <p className="mt-3 text-sm text-slate-500">{card.text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
