"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import type { HeroSlide, HeroSlideTranslatedContent } from "@/types/hero";

interface HeroSectionProps {
    slides: HeroSlide[]; // Carousel slides from API
    language: string; // Current language
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

export function HeroSection({ slides, language, motionEnabled, heroBgRef }: HeroSectionProps) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    // Get current slide and its content
    const currentSlide = slides[activeSlideIndex] || slides[0];
    const currentContent: HeroSlideTranslatedContent = currentSlide?.translations[language as 'en' | 'de' | 'el'] || currentSlide?.translations.en;
    const currentDuration = currentSlide?.transitionDuration || 5000;

    useEffect(() => {
        if (!slides || slides.length === 0) return;

        const interval = setInterval(() => {
            setActiveSlideIndex((prev) => (prev + 1) % slides.length);
        }, currentDuration);

        return () => clearInterval(interval);
    }, [slides, currentDuration]);

    // Handle empty slides gracefully
    if (!slides || slides.length === 0 || !currentSlide || !currentContent) {
        return null;
    }

    return (
        <section
            className="relative flex min-h-[85vh] items-center scroll-mt-24 snap-start"
            id="experience"
        >
            <motion.div
                ref={heroBgRef}
                className="hero-parallax absolute inset-0"
                {...(motionEnabled
                    ? { initial: "hidden", animate: "show", variants: heroBgVariants }
                    : { initial: false })}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide._id || index}
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                        style={{
                            backgroundImage: `url('${slide.imageUrl}')`,
                            opacity: activeSlideIndex === index ? 1 : 0,
                            zIndex: activeSlideIndex === index ? 1 : 0
                        }}
                    />
                ))}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            <div className="hero-orb" aria-hidden="true" />
            <motion.div
                className="relative mx-auto flex w-[min(1200px,92vw)] flex-col gap-6 py-24 text-white"
                {...(motionEnabled
                    ? { initial: "hidden", animate: "show", variants: heroContainerVariants }
                    : { initial: false })}
            >
                {/* Semi-transparent background box for text content */}
                <div className="backdrop-blur-md bg-black/30 rounded-3xl px-8 py-10 md:px-12 md:py-14 border border-white/10 shadow-2xl">
                    <motion.p
                        variants={heroItemVariants}
                        className="text-xs font-bold uppercase tracking-[0.4em] text-white/70"
                    >
                        {currentContent.label}
                    </motion.p>
                    <motion.h1
                        variants={heroItemVariants}
                        className="display-title text-4xl font-extrabold leading-tight md:text-6xl mt-4"
                    >
                        {currentContent.title}{" "}
                        <span className="text-transparent bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] bg-clip-text">
                            {currentContent.highlight}
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={heroItemVariants}
                        className="max-w-xl text-lg text-white/90 mt-6"
                    >
                        {currentContent.subhead}
                    </motion.p>
                    <motion.div variants={heroItemVariants} className="flex flex-wrap gap-4 mt-8">
                        <a
                            href="#destinations"
                            className="cta-luxe rounded-full bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] px-8 py-3 text-sm font-bold"
                        >
                            {currentContent.primaryCta}
                        </a>
                        <a
                            href="/packages"
                            className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                        >
                            {currentContent.secondaryCta}
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    variants={heroItemVariants}
                    className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70"
                >
                    Scroll
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
