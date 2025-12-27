"use client";

import { useState, useEffect } from "react";
import translationsData from "@/data/translations.json";
import { Language, Translations, LanguageOption } from "@/types";

const translations = translationsData as Record<Language, Translations>;

export const languageOptions: LanguageOption[] = [
    { id: "en", label: "English" },
    { id: "de", label: "German" },
    { id: "el", label: "Greek" },
];

export function useTranslation() {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const stored = localStorage.getItem("menescape-language");
        if (stored === "en" || stored === "de" || stored === "el") {
            setLanguage(stored as Language);
        }
    }, []);

    const handleChangeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("menescape-language", lang);
        document.documentElement.lang = lang;
    };

    return {
        t: translations[language],
        language,
        setLanguage: handleChangeLanguage,
        languageOptions,
        translations
    };
}
