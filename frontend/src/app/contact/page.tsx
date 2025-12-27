"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";

export default function ContactPage() {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <SiteLayout>
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="font-serif text-5xl font-bold text-[var(--navy)] md:text-6xl">
                            {t.contact.title}
                        </h1>
                        <p className="mt-4 text-lg text-slate-500 font-light">
                            {t.contact.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-12"
                        >
                            <div className="p-8 rounded-3xl bg-white shadow-xl border border-black/5">
                                <h3 className="text-xl font-bold text-[var(--navy)] mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[var(--gold)]">mail</span>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-slate-400">Email</p>
                                            <a href={`mailto:${t.contact.info.email}`} className="text-lg font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors">
                                                {t.contact.info.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[var(--gold)]">call</span>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-slate-400">Phone</p>
                                            <a href={`tel:${t.contact.info.phone}`} className="text-lg font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors">
                                                {t.contact.info.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
                                <div className="absolute inset-0 bg-[var(--navy)]" />
                                {/* Map or decorative image could go here */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <span className="material-symbols-outlined text-9xl text-white">public</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-black/5"
                        >
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                                        <span className="material-symbols-outlined text-3xl">check</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[var(--navy)] mb-2">Thank you</h3>
                                    <p className="text-slate-500">{t.contact.form.success}</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-sm font-bold text-[var(--navy)] underline opacity-50 hover:opacity-100"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                            {t.contact.form.name}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full rounded-xl border border-black/10 bg-slate-50 px-4 py-3 text-[var(--navy)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                            {t.contact.form.email}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full rounded-xl border border-black/10 bg-slate-50 px-4 py-3 text-[var(--navy)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                            {t.contact.form.message}
                                        </label>
                                        <textarea
                                            rows={5}
                                            required
                                            className="w-full rounded-xl border border-black/10 bg-slate-50 px-4 py-3 text-[var(--navy)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)] transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-xl bg-[var(--navy)] py-4 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Sending...
                                            </span>
                                        ) : (
                                            t.contact.form.submit
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
