"use client";

import { motion, type Variants } from "framer-motion";
import type { Translations, Testimonial } from "@/types";

interface CommunitySectionProps {
    copy: Translations;
    communityPersonas: string[];
    testimonials: Testimonial[];
    testimonialIndex: number;
    setTestimonialIndex: (index: number | ((prev: number) => number)) => void;
    testimonialPaused: boolean;
    setTestimonialPaused: (paused: boolean | ((prev: boolean) => boolean)) => void;
    getTestimonialText: (index: number) => { quote?: string; author?: string } | null;
    motionEnabled: boolean;
    language: string;
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

const personaIcons = ["bolt", "pets", "workspace_premium", "person", "favorite"];

export function CommunitySection({
    copy,
    communityPersonas,
    testimonials,
    testimonialIndex,
    setTestimonialIndex,
    testimonialPaused,
    setTestimonialPaused,
    getTestimonialText,
    motionEnabled,
    language,
}: CommunitySectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    const current = testimonials[testimonialIndex];
    const translated = getTestimonialText(testimonialIndex);

    return (
        <section className="coast-pattern py-24 scroll-mt-24 snap-start" id="community">
            <div className="mx-auto w-[min(1200px,92vw)] relative">
                {motionEnabled ? (
                    <motion.div
                        className="community-orb"
                        aria-hidden="true"
                        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                ) : (
                    <div className="community-orb" aria-hidden="true" />
                )}
                <motion.div className="mb-10" {...sectionHeaderMotion}>
                    <div className="flex items-center gap-3">
                        <span className="header-symbol">
                            <span className="material-symbols-outlined text-sm text-white">
                                diversity_3
                            </span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            {copy.community.label}
                        </p>
                    </div>
                    <h2 className="display-title mt-4 text-3xl font-bold md:text-4xl">
                        {copy.community.title}
                    </h2>
                    <div className="section-rule mt-4" />
                    <svg className="section-motif" viewBox="0 0 160 18" aria-hidden="true">
                        <path d="M0 10 C 20 4, 40 4, 60 10 S 100 16, 120 10 S 150 4, 160 10" />
                    </svg>
                    <p className="mt-2 text-slate-500">{copy.community.subtitle}</p>
                </motion.div>
                <motion.div
                    key={`personas-${language}`}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
                    {...(motionEnabled
                        ? {
                            initial: "hidden",
                            whileInView: "show",
                            viewport: { once: true, amount: 0.35 },
                            variants: {
                                show: { transition: { staggerChildren: 0.08 } },
                            },
                        }
                        : { initial: false })}
                >
                    {communityPersonas.map((label, index) => (
                        <motion.div
                            key={label}
                            variants={{
                                hidden: { opacity: 0, y: 14 },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.6, ease: motionEase },
                                },
                            }}
                            className="lux-card rounded-2xl bg-white p-6 text-center"
                        >
                            <span className="material-symbols-outlined text-3xl text-[var(--navy)]">
                                {personaIcons[index]}
                            </span>
                            <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                                {label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <div data-reveal className="reveal lux-card mt-12 rounded-3xl bg-white p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                        {copy.community.testimonialsLabel}
                    </p>
                    <div
                        className="mt-6 overflow-hidden"
                        onPointerEnter={() => setTestimonialPaused(true)}
                        onPointerLeave={() => setTestimonialPaused(false)}
                        onPointerDown={() => setTestimonialPaused(true)}
                        onFocusCapture={() => setTestimonialPaused(true)}
                    >
                        <motion.div
                            key={`testimonial-${testimonialIndex}`}
                            initial={motionEnabled ? { opacity: 0, y: 8 } : false}
                            animate={motionEnabled ? { opacity: 1, y: 0 } : undefined}
                            transition={{ duration: 0.6, ease: motionEase }}
                        >
                            <div>
                                <p className="text-lg text-slate-500">
                                    "{translated?.quote ?? current.quote}"
                                </p>
                                <p className="mt-4 font-semibold text-[var(--navy)]">
                                    {translated?.author ?? current.author}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-[var(--navy)]">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setTestimonialIndex(
                                        (prev) => (prev - 1 + testimonials.length) % testimonials.length
                                    )
                                }
                                aria-label="Previous review"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <button
                                onClick={() =>
                                    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
                                }
                                aria-label="Next review"
                            >
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    className={`h-2.5 w-2.5 rounded-full transition ${testimonialIndex === index
                                            ? "bg-[var(--navy)]"
                                            : "bg-black/10"
                                        }`}
                                    onClick={() => setTestimonialIndex(index)}
                                    aria-label={`Go to review ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            className="rounded-full border border-[var(--navy)] px-4 py-2 text-xs font-bold text-[var(--navy)]"
                            onClick={() => setTestimonialPaused((paused) => !paused)}
                        >
                            {testimonialPaused ? copy.community.play : copy.community.pause}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
