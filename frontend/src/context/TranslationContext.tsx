"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import translationsData from "@/data/translations.json";
import { Language, Translations, LanguageOption } from "@/types";

const translations = translationsData as Record<Language, Translations>;

export const languageOptions: LanguageOption[] = [
    { id: "en", label: "English" },
    { id: "de", label: "German" },
    { id: "el", label: "Greek" },
];

interface TranslationContextType {
    t: Translations;
    language: Language;
    setLanguage: (lang: Language) => void;
    languageOptions: LanguageOption[];
    translations: Record<Language, Translations>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Initialize from localStorage on mount, fallback to browser language detection
    useEffect(() => {
        const stored = localStorage.getItem("menescape-language");
        if (stored === "en" || stored === "de" || stored === "el") {
            setLanguage(stored as Language);
        } else {
            // Auto-detect browser language if no stored preference
            const browserLang = navigator.language || (navigator as any).userLanguage || "";
            const langCode = browserLang.split("-")[0].toLowerCase();

            // Map browser language to supported language
            if (langCode === "de") {
                setLanguage("de");
                localStorage.setItem("menescape-language", "de");
            } else if (langCode === "el") {
                setLanguage("el");
                localStorage.setItem("menescape-language", "el");
            } else {
                // Default to English for unsupported languages
                setLanguage("en");
                localStorage.setItem("menescape-language", "en");
            }
        }

        // Set document language attribute
        document.documentElement.lang = language;
    }, []);

    const handleChangeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("menescape-language", lang);
        document.documentElement.lang = lang;
    };

    const value = {
        t: translations[language],
        language,
        setLanguage: handleChangeLanguage,
        languageOptions,
        translations
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslationContext() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error("useTranslationContext must be used within a TranslationProvider");
    }
    return context;
}
