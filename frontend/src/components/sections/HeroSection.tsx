"use client";

import { motion, type Variants } from "framer-motion";
import type { Translations } from "@/types";

interface HeroSectionProps {
    copy: Translations;
    motionEnabled: boolean;
    heroBgRef: React.RefObject<HTMLDivElement | null>;
}

const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: motionEase },
    },
};

const heroBgVariants: Variants = {
    hidden: { opacity: 0, scale: 1.06, clipPath: "inset(0 0 100% 0)" },
    show: {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0 0 0% 0)",
        transition: { duration: 1.4, ease: motionEase },
    },
};

export function HeroSection({ copy, motionEnabled, heroBgRef }: HeroSectionProps) {
    return (
        <section
            className="relative flex min-h-[85vh] items-center scroll-mt-24 snap-start"
            id="experience"
        >
            <motion.div
                ref={heroBgRef}
                className="hero-parallax absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsy8X8lAcIDSWq3AX4BeBPez2_-qrz0cyfANL9gJtNL7nNGWgzFc6WQZCoSRIVtMlxrmwhjdTpdqcgedQKFhLCFq35cHiI_gw4lbRFbspUepL_wwGLoAGfHavKoqQwtevjeYo9JRNNi-bkX9xh3ctG474wx8pPmX4wFI2Q6iPVWHhfpKUXF2f42FRvipTHqdho3RLK7ubAswvMZR33R3FYQd2RR8G09qMKtRMwmpbN4aSLC_j6c7U8-pPflje65RH4yVwKuE-THh0')] bg-cover bg-center"
                {...(motionEnabled
                    ? { initial: "hidden", animate: "show", variants: heroBgVariants }
                    : { initial: false })}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            <div className="hero-orb" aria-hidden="true" />
            <motion.div
                className="relative mx-auto flex w-[min(1200px,92vw)] flex-col gap-6 py-24 text-white"
                {...(motionEnabled
                    ? { initial: "hidden", animate: "show", variants: heroContainerVariants }
                    : { initial: false })}
            >
                <motion.p
                    variants={heroItemVariants}
                    className="text-xs font-bold uppercase tracking-[0.4em] text-white/70"
                >
                    {copy.hero.label}
                </motion.p>
                <motion.h1
                    variants={heroItemVariants}
                    className="display-title text-4xl font-extrabold leading-tight md:text-6xl"
                >
                    {copy.hero.title}{" "}
                    <span className="text-transparent bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] bg-clip-text">
                        {copy.hero.highlight}
                    </span>
                </motion.h1>
                <motion.p
                    variants={heroItemVariants}
                    className="max-w-xl text-lg text-white/80"
                >
                    {copy.hero.subhead}
                </motion.p>
                <motion.div variants={heroItemVariants} className="flex flex-wrap gap-4">
                    <a
                        href="#destinations"
                        className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-8 py-3 text-sm font-bold"
                    >
                        {copy.hero.primaryCta}
                    </a>
                    <a
                        href="#itinerary"
                        className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold"
                    >
                        {copy.hero.secondaryCta}
                    </a>
                </motion.div>
                <motion.div
                    variants={heroItemVariants}
                    className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70"
                >
                    {copy.hero.scroll}
                    <span className="material-symbols-outlined text-base animate-bounce">
                        expand_more
                    </span>
                </motion.div>
                <motion.svg
                    variants={heroItemVariants}
                    className="hero-wave"
                    viewBox="0 0 600 40"
                    aria-hidden="true"
                >
                    <path d="M0 24 C 60 8, 120 8, 180 24 S 300 40, 360 24 S 480 8, 540 24 S 600 40, 600 40" />
                </motion.svg>
            </motion.div>
        </section>
    );
}
