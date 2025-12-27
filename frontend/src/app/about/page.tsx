"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src="/resort-life.jpg" // Specific about image
                    alt="About MenEscape"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--background)]" />

                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl font-bold text-white md:text-7xl"
                    >
                        {t.about.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-4 max-w-2xl text-lg font-light tracking-wide text-white/90 md:text-xl"
                    >
                        {t.about.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="px-6 py-20 md:px-12 lg:px-24">
                <div className="mx-auto max-w-4xl space-y-12">
                    {t.about.content.map((paragraph, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="border-l-2 border-[var(--gold)] pl-8"
                        >
                            <p className="font-serif text-xl leading-relaxed text-[var(--foreground)] md:text-2xl">
                                {paragraph}
                            </p>
                        </motion.div>
                    ))}

                    {/* Visual Break */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative mt-16 aspect-video w-full overflow-hidden rounded-2xl"
                    >
                        <Image
                            src="/pineapple.jpg" // Visual break image
                            alt="MenEscape Experience"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>
        </SiteLayout>
    );
}
