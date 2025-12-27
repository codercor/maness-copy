"use client";

import { motion, type Variants } from "framer-motion";
import type { Translations, GalleryItem, GalleryContentTranslation } from "@/types";

interface GallerySectionProps {
    copy: Translations;
    gallery: GalleryItem[];
    getGalleryText: (title: string) => GalleryContentTranslation | null;
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

export function GallerySection({
    copy,
    gallery,
    getGalleryText,
    motionEnabled,
}: GallerySectionProps) {
    const sectionHeaderMotion = motionEnabled
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, amount: 0.45 },
            variants: sectionHeaderVariants,
        }
        : { initial: false as const };

    return (
        <section className="py-24 scroll-mt-24 snap-start" id="destination-gallery">
            <div className="mx-auto w-[min(1200px,92vw)]">
                <motion.div className="mb-10" {...sectionHeaderMotion}>
                    <div className="flex items-center gap-3">
                        <span className="header-symbol">
                            <span className="material-symbols-outlined text-sm text-white">
                                auto_awesome
                            </span>
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                            {copy.gallery.label}
                        </p>
                    </div>
                    <h2 className="display-title mt-4 text-3xl font-bold md:text-4xl">
                        {copy.gallery.title}
                    </h2>
                    <div className="section-rule mt-4" />
                    <svg className="section-motif" viewBox="0 0 160 18" aria-hidden="true">
                        <path d="M0 10 C 20 4, 40 4, 60 10 S 100 16, 120 10 S 150 4, 160 10" />
                    </svg>
                    <p className="mt-2 text-slate-500">{copy.gallery.subtitle}</p>
                </motion.div>
                <div className="relative">
                    {motionEnabled ? (
                        <motion.div
                            className="gallery-mask"
                            aria-hidden="true"
                            initial={{ x: "0%" }}
                            whileInView={{ x: "110%" }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 1.2, ease: motionEase }}
                        />
                    ) : null}
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        {...(motionEnabled
                            ? {
                                initial: "hidden",
                                whileInView: "show",
                                viewport: { once: true, amount: 0.25 },
                                variants: {
                                    show: { transition: { staggerChildren: 0.08 } },
                                },
                            }
                            : { initial: false })}
                    >
                        {gallery.map((item, index) => {
                            const galleryText = getGalleryText(item.title);
                            return (
                                <motion.article
                                    key={item.title}
                                    {...(motionEnabled
                                        ? {
                                            variants: {
                                                hidden: { opacity: 0, y: 18 },
                                                show: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: { duration: 0.7, ease: motionEase },
                                                },
                                            },
                                        }
                                        : {})}
                                    className={`gallery-card lux-card group overflow-hidden rounded-3xl bg-white ${item.featured ? "lg:col-span-2" : ""}`}
                                >
                                    <div className="curtain-reveal relative h-64 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                                                {copy.gallery.quickLook}
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {galleryText?.quickLook ?? item.quickLook}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {item.featured && (
                                            <span className="lux-badge lux-badge--navy">
                                                {galleryText?.duration ?? item.duration}
                                            </span>
                                        )}
                                        <h3 className="mt-3 text-xl font-bold">
                                            {galleryText?.title ?? item.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {galleryText?.description ?? item.description}
                                        </p>
                                        <div className="mt-6 flex items-center justify-between">
                                            <div>
                                                <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                                                    {item.featured
                                                        ? copy.gallery.startingFrom
                                                        : galleryText?.duration ?? item.duration}
                                                </span>
                                                <strong className="text-lg text-[var(--navy)]">
                                                    {item.price}
                                                </strong>
                                            </div>
                                            <button
                                                className={`gallery-cta rounded-full px-4 py-2 text-xs font-bold ${item.featured
                                                    ? "gallery-cta--featured bg-[linear-gradient(135deg,_#ec4899,_#3b82f6)] text-white shadow-lg shadow-blue-500/30"
                                                    : "border border-[var(--navy)] text-[var(--navy)]"
                                                    }`}
                                            >
                                                {copy.gallery.viewDetails}
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
