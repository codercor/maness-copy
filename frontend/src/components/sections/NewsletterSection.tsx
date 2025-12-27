"use client";

import { motion, type Variants } from "framer-motion";
import type { FormEvent } from "react";
import type { Translations } from "@/types";

interface NewsletterSectionProps {
    copy: Translations;
    newsletterEmail: string;
    setNewsletterEmail: (email: string) => void;
    newsletterStatus: string;
    onSubmit: (event: FormEvent) => void;
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

export function NewsletterSection({
    copy,
    newsletterEmail,
    setNewsletterEmail,
    newsletterStatus,
    onSubmit,
    motionEnabled,
}: NewsletterSectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    return (
        <section className="py-20 scroll-mt-24 snap-start" id="newsletter">
            <div className="mx-auto w-[min(1100px,92vw)]">
                <motion.div
                    className="lux-card rounded-3xl bg-white px-8 py-10 md:px-12"
                    {...sectionHeaderMotion}
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                                {copy.newsletter.label}
                            </p>
                            <h2 className="display-title mt-3 text-3xl font-bold text-[var(--navy)]">
                                {copy.newsletter.title}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                {copy.newsletter.subtitle}
                            </p>
                        </div>
                        <form
                            className="flex w-full flex-col gap-3 sm:flex-row md:max-w-lg"
                            onSubmit={onSubmit}
                        >
                            <input
                                type="email"
                                required
                                className="lux-field flex-1 px-4 py-3 text-sm"
                                placeholder={copy.newsletter.placeholder}
                                value={newsletterEmail}
                                onChange={(event) => setNewsletterEmail(event.target.value)}
                            />
                            <button
                                type="submit"
                                className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30"
                            >
                                {copy.newsletter.button}
                            </button>
                        </form>
                    </div>
                    {newsletterStatus && (
                        <p className="mt-4 text-sm font-semibold text-[var(--navy)]">
                            {newsletterStatus}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
