"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

export function CookieConsent() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("menescape-cookie-consent");
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("menescape-cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("menescape-cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-xl md:left-auto md:right-6"
                >
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/20 bg-[var(--navy)]/90 p-6 shadow-2xl backdrop-blur-md md:flex-row">
                        <p className="text-sm font-medium text-white/90">
                            {t.cookie.message}
                        </p>
                        <div className="flex w-full gap-3 md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10 md:flex-none"
                            >
                                {t.cookie.decline}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 rounded-full bg-white px-6 py-2 text-xs font-bold text-[var(--navy)] shadow-lg transition-transform hover:scale-105 active:scale-95 md:flex-none"
                            >
                                {t.cookie.accept}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
