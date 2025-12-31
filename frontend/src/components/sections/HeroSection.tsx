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
    const textTransitionType = currentSlide?.textTransitionType || 'fade';

    // Generate text animation variants based on transition type
    const getTextVariants = (type: string): Variants => {
        switch (type) {
            case 'fade':
            case 'crossfade':
                return {
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'slide-up':
                return {
                    hidden: { opacity: 0, y: 40 },
                    show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'slide-down':
                return {
                    hidden: { opacity: 0, y: -40 },
                    show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'slide-left':
                return {
                    hidden: { opacity: 0, x: 60 },
                    show: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'slide-right':
                return {
                    hidden: { opacity: 0, x: -60 },
                    show: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'zoom-in':
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    show: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'zoom-out':
                return {
                    hidden: { opacity: 0, scale: 1.2 },
                    show: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'blur':
                return {
                    hidden: { opacity: 0, filter: 'blur(10px)' },
                    show: {
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: { duration: 0.8, ease: motionEase },
                    },
                };
            case 'typing':
                return {
                    hidden: { opacity: 0, x: -20 },
                    show: {
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 0.5,
                            ease: "linear",
                            staggerChildren: 0.1
                        },
                    },
                };
            default:
                return heroItemVariants;
        }
    };

    const textVariants = getTextVariants(textTransitionType);

    useEffect(() => {
        if (!slides || slides.length === 0) return;

        const interval = setInterval(() => {
            setActiveSlideIndex((prev) => (prev + 1) % slides.length);
        }, currentDuration);

        return () => clearInterval(interval);
    }, [slides, currentDuration, activeSlideIndex]);

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
                {slides.map((slide, index) => {
                    const isActive = activeSlideIndex === index;
                    const transitionType = slide.transitionType || 'crossfade';

                    // Define transition classes based on type
                    let transitionClass = 'transition-opacity duration-1000 ease-in-out';
                    let transformStyle = {};

                    switch (transitionType) {
                        case 'fade':
                            transitionClass = 'transition-opacity duration-700 ease-in-out';
                            break;
                        case 'crossfade':
                            transitionClass = 'transition-opacity duration-1000 ease-in-out';
                            break;
                        case 'slide-left':
                            transitionClass = 'transition-all duration-800 ease-in-out';
                            transformStyle = { transform: isActive ? 'translateX(0)' : 'translateX(100%)' };
                            break;
                        case 'slide-right':
                            transitionClass = 'transition-all duration-800 ease-in-out';
                            transformStyle = { transform: isActive ? 'translateX(0)' : 'translateX(-100%)' };
                            break;
                        case 'slide-up':
                            transitionClass = 'transition-all duration-800 ease-in-out';
                            transformStyle = { transform: isActive ? 'translateY(0)' : 'translateY(100%)' };
                            break;
                        case 'slide-down':
                            transitionClass = 'transition-all duration-800 ease-in-out';
                            transformStyle = { transform: isActive ? 'translateY(0)' : 'translateY(-100%)' };
                            break;
                        case 'zoom-in':
                            transitionClass = 'transition-all duration-1000 ease-in-out';
                            transformStyle = {
                                transform: isActive ? 'scale(1)' : 'scale(1.2)',
                                opacity: isActive ? 1 : 0
                            };
                            break;
                        case 'zoom-out':
                            transitionClass = 'transition-all duration-1000 ease-in-out';
                            transformStyle = {
                                transform: isActive ? 'scale(1)' : 'scale(0.8)',
                                opacity: isActive ? 1 : 0
                            };
                            break;
                        case 'blur':
                            transitionClass = 'transition-all duration-800 ease-in-out';
                            transformStyle = {
                                filter: isActive ? 'blur(0px)' : 'blur(10px)',
                                opacity: isActive ? 1 : 0
                            };
                            break;
                    }

                    return (
                        <div
                            key={slide._id || index}
                            className={`absolute inset-0 bg-cover bg-center ${transitionClass}`}
                            style={{
                                backgroundImage: `url('${slide.imageUrl}')`,
                                opacity: transitionType === 'fade' || transitionType === 'crossfade' || transitionType === 'typing' ? (isActive ? 1 : 0) : undefined,
                                zIndex: isActive ? 1 : 0,
                                ...transformStyle
                            }}
                        />
                    );
                })}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            <div className="hero-orb" aria-hidden="true" />
            <motion.div
                key={`slide-${activeSlideIndex}-${textTransitionType}`}
                className="relative mx-auto flex w-[min(1200px,92vw)] flex-col gap-6 py-24 text-white"
                {...(motionEnabled
                    ? { initial: "hidden", animate: "show", variants: heroContainerVariants }
                    : { initial: false })}
            >
                {/* Semi-transparent background box for text content */}
                <motion.div className="backdrop-blur-md bg-black/30 rounded-3xl px-8 py-10 md:px-12 md:py-14 border border-white/10 shadow-2xl">
                    <motion.p
                        variants={textVariants}
                        className="text-xs font-bold uppercase tracking-[0.4em] text-white/70"
                    >
                        {currentContent.label}
                    </motion.p>
                    <motion.h1
                        variants={textVariants}
                        className="display-title text-4xl font-extrabold leading-tight md:text-6xl mt-4"
                    >
                        {currentContent.title}{" "}
                        <span className="text-transparent bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] bg-clip-text">
                            {currentContent.highlight}
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={textVariants}
                        className="max-w-xl text-lg text-white/90 mt-6"
                    >
                        {currentContent.subhead}
                    </motion.p>
                    <motion.div variants={textVariants} className="flex flex-wrap gap-4 mt-8">
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
                </motion.div>

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

            {/* Carousel Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-110 active:scale-95 group"
                        aria-label="Previous slide"
                    >
                        <span className="material-symbols-outlined text-3xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                    </button>
                    <button
                        onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-110 active:scale-95 group"
                        aria-label="Next slide"
                    >
                        <span className="material-symbols-outlined text-3xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveSlideIndex(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === activeSlideIndex
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
